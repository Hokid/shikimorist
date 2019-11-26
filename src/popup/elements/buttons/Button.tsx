import React from 'react';
import classes from './Button.module.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    theme?: 'default' | 'link'
};

export function Button(props: Props) {
    let className = classes.button;

    if (props.theme === 'default' || !props.theme) {
        className += ' ' + classes.default;
    } else if (props.theme === 'link') {
        className += ' ' + classes.link;
    }

    if (props.className) {
        className += ' ' + props.className;
    }

    return (
        <button
            {...props}
            className={className}
        />
    );
}
