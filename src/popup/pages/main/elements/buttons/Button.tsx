import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: Props) {
    return (
        <button
            {...props}
            style={{
                background: '#1d78b7',
                color: '#ffffff',
                outline: 'none',
                border: 0,
                lineHeight: '20px',
                fontSize: '14px',
                padding: '6px 12px',
                cursor: 'pointer',
                ...props.style,
            }}
        />
    );
}
