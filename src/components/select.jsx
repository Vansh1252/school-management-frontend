import React from "react";

// Reusable select/dropdown component for forms
const Fromselect = ({ label, name, value, onChange, options, required }) => {
    return (
        <div className="form-group">
            {/* Label with required asterisk if needed */}
            <label>
                {label} {required && <span className="required">*</span>}
            </label>
            {/* Select dropdown */}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="form-input"
            >
                <option value="">Please Select</option>
                {/* Render options */}
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Fromselect;
