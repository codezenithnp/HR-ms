import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

interface InputFieldProps extends BaseFieldProps, InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'tel';
}

interface SelectFieldProps extends BaseFieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  type: 'select';
  options: { value: string; label: string }[];
}

interface TextareaFieldProps extends BaseFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: 'textarea';
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

export const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, error, required, helpText, ...rest } = props;
  const id = rest.id || rest.name || label.toLowerCase().replace(/\s+/g, '-');

  const renderField = () => {
    if (props.type === 'select') {
      const { options, label: _l, error: _e, required: _r, helpText: _h, ...selectProps } = props as SelectFieldProps;
      return (
        <select
          {...selectProps}
          id={id}
          className={`form-select ${error ? 'is-invalid' : ''}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (props.type === 'textarea') {
      const { label: _l, error: _e, required: _r, helpText: _h, ...textareaProps } =
        props as TextareaFieldProps & BaseFieldProps;
      return (
        <textarea
          {...(textareaProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          id={id}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
      );
    } else {
      const { label: _l, error: _e, required: _r, helpText: _h, ...inputProps } =
        props as InputFieldProps & BaseFieldProps;
      return (
        <input
          {...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
          type={props.type || 'text'}
          id={id}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
      );
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
        {required && (
          <span style={{ color: 'var(--af-primary)', marginLeft: '0.25rem' }}>*</span>
        )}
      </label>
      {renderField()}
      {helpText && (
        <div className="form-text">{helpText}</div>
      )}
      {error && (
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-label)',
            color: 'var(--af-error)',
            marginTop: '0.25rem',
            display: 'block',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
