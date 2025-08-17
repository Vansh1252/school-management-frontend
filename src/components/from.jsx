import React from "react";

// Reusable form field component for input elements
const FormField = ({
    label,
    type = "text",
    placeholder = "",
    required = false,
    value,
    onChange,
    name,
}) => {
    return (
        <div className="form-group">
            {/* Label with required asterisk if needed */}
            <label>
                {label} {required && <span className="required">*</span>}
            </label>
            {/* Input field */}
            <input
                type={type}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                name={name}
                className="form-input"
            />
        </div>
    );
};

export default FormField;