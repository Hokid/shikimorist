import React from 'react';
import classes from './Counter.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


type Props = {
    loading?: boolean;
    max?: number;
    current: number;
    onUp(): any;
    onDown(): any;
}

export function Counter(props: Props) {
    return (
        <div
            style={{
                textAlign: 'center',
            }}
        >
            <button
                className={classes.button}
                disabled={props.loading}
                onClick={props.onDown}
            >
                <FontAwesomeIcon
                    icon="minus"
                />
            </button>
            <span className={classes.number}>
                {props.current}
                {
                    !!props.max && (
                        <span> ({props.max})</span>
                    )
                }
            </span>
            <button
                className={classes.button}
                disabled={props.loading || (!!props.max && props.max <= props.current)}
                onClick={props.onUp}
            >
                <FontAwesomeIcon
                    icon="plus"
                />
            </button>
        </div>
    );
}
