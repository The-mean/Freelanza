import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    border?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    shadow = 'md',
    border = false,
    onClick,
}) => {
    const paddingClasses = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-7',
    };

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow',
        lg: 'shadow-lg',
    };

    const borderClass = border ? 'border border-neutral-200' : '';
    const cursorClass = onClick ? 'cursor-pointer' : '';

    return (
        <div
            className={`
        bg-white 
        rounded-lg 
        ${paddingClasses[padding]} 
        ${shadowClasses[shadow]} 
        ${borderClass} 
        ${cursorClass} 
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card; 