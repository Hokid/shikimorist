import React from 'react';
import classes from './SideButton.module.css';

type Props = {
    onClick(): any;
    icon: React.ReactElement;
}

export function SideButton(props: Props) {
    return (
        <button
            className={classes.button}
            onClick={props.onClick}
        >
            {props.icon}
        </button>
    );
}
