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
      const { options, ...selectProps } = rest as SelectFieldProps;
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
      const textareaProps = rest as TextareaHTMLAttributes<HTMLTextAreaElement>;
      return (
        <textarea
          {...textareaProps}
          id={id}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
      );
    } else {
      const inputProps = rest as InputHTMLAttributes<HTMLInputElement>;
      return (
        <input
          {...inputProps}
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
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      {renderField()}
      {helpText && <div className="form-text">{helpText}</div>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};
