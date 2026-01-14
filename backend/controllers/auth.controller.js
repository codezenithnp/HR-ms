import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Controlled by env or Admin only)
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(`[Auth Debug] Register request for: ${email}`);

    // Check if first admin bootstrap is allowed or if user is admin
    const isFirstAdmin = (await User.countDocuments({})) === 0;
    const allowBootstrap = process.env.ALLOW_ADMIN_BOOTSTRAP === 'true';

    if (!isFirstAdmin && (!req.user || req.user.role !== 'admin')) {
        res.status(403);
        throw new Error('Not authorized to register new users');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: isFirstAdmin ? 'admin' : role || 'employee',
        isEmailVerified: isFirstAdmin ? true : false, // First admin auto-verified
    });

    if (user) {
        // Generate verification token
        const verificationToken = user.getEmailVerificationToken();
        await user.save();

        // Create verification url (Frontend)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;

        const message = `You are receiving this email because you (or an administrator) have registered an account on CodeZenith HRMS.\n\nPlease click on the following link to verify your email:\n\n${verifyUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification',
                message,
            });
        } catch (error) {
            console.error(error);
            // We don't delete user, but maybe log failure
            user.emailVerificationToken = undefined;
            user.emailVerificationExpire = undefined;
            await user.save({ validateBeforeSave: false });
            // return res.status(500).json({ message: 'Email could not be sent' });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            message: 'User registered. Verification email sent.',
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
    console.log(`[Auth Debug] Forgot password request for: ${req.body.email}`);
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('There is no user with that email');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url (Frontend)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent');
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        data: generateToken(user._id),
    });
};

// @desc    Verify Email
// @route   PUT /api/auth/verifyemail/:token
// @access  Public
export const verifyEmail = async (req, res) => {
    const emailVerificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        data: 'Email verified',
    });
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
    const { token, isAdminRequest } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub: googleId, picture } = ticket.getPayload();

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Update googleId if not present (merging accounts)
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save({ validateBeforeSave: false });
            }
        } else {
            // Check if this is the first user -> Admin
            const count = await User.countDocuments({});

            // STRICT POLICY: Employees cannot register themselves.
            // Only allow creation if:
            // 1. It's the very first user (System Bootstrap)
            // 2. It's an explicit Admin Registration request (from /admin/register)

            if (count === 0 || isAdminRequest) {
                const role = 'admin';
                const password = crypto.randomBytes(16).toString('hex');

                user = await User.create({
                    name,
                    email,
                    googleId,
                    password,
                    role,
                    isEmailVerified: true,
                });
            } else {
                // Block public registration for employees
                res.status(403); // Forbidden
                throw new Error('Account not found. Employees must be invited by an Admin.');
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401);
        throw new Error('Google authentication failed');
    }
};

// @desc    Change Password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res) => {
    const user = await User.findById(req.user._id).select('+password');

    if (await user.matchPassword(req.body.currentPassword)) {
        user.password = req.body.newPassword;
        await user.save();

        res.json({
            success: true,
            token: generateToken(user._id),
            message: 'Password updated successfully'
        });
    } else {
        res.status(401);
        throw new Error('Invalid current password');
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
