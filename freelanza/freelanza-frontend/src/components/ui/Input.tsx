import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, helperText, error, leftIcon, rightIcon, fullWidth = true, className = '', ...props }, ref) => {
        const inputWrapperClasses = `
      relative ${fullWidth ? 'w-full' : ''}
    `;

        const inputClasses = `
      input 
      ${leftIcon ? 'pl-10' : ''} 
      ${rightIcon ? 'pr-10' : ''} 
      ${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}
      ${className}
    `;

        return (
            <div className={inputWrapperClasses}>
                {label && (
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={inputClasses}
                        aria-invalid={error ? 'true' : 'false'}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-500">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {(helperText || error) && (
                    <p className={`mt-1 text-sm ${error ? 'text-danger-500' : 'text-neutral-500'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input; 