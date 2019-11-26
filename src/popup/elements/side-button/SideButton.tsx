import React from 'react';
import classes from './SideButton.module.css';

type Props = {
    onClick(): any;
    icon: React.ReactElement;
    disabled?: boolean;
}

export function SideButton(props: Props) {
    return (
        <button
            className={classes.button}
            onClick={props.onClick}
            disabled={!!props.disabled}
        >
            {props.icon}
        </button>
    );
}
