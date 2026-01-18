import AuditLog from '../models/AuditLog.js';

/**
 * Create an audit log entry
 * @param {Object} options - Audit log options
 * @param {Object} options.user - User object from req.user
 * @param {string} options.action - Action performed (e.g., 'CREATE', 'UPDATE', 'DELETE', 'APPROVE')
 * @param {string} options.entity - Entity type (e.g., 'Employee', 'LeaveRequest', 'Attendance')
 * @param {string} options.entityId - ID of the entity
 * @param {Object} options.details - Additional details about the action
 * @param {string} options.ipAddress - IP address of the request
 */
export const createAuditLog = async ({ user, action, entity, entityId, details, ipAddress }) => {
    try {
        await AuditLog.create({
            user: user._id,
            action,
            entity,
            entityId,
            details,
            ipAddress,
        });
    } catch (error) {
        console.error('Error creating audit log:', error);
        // Don't throw - audit logging shouldn't break the main operation
    }
};

/**
 * Get IP address from request
 */
export const getIpAddress = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
};
