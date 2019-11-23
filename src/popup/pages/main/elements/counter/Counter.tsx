import React, {useState} from 'react';
import classes from './Counter.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


type Props = {
    loading?: boolean;
    max?: number;
    current: number;
    onUp(): any;
    onChange(value: number): any;
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
            <Value
                current={props.current}
                max={props.max}
                onChange={props.onChange}
            />
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

type ValueProps = {
    current: number;
    max?: number;
    onChange(value: number): any;
}

function Value(props: ValueProps) {
    const [isEditable, setEditable] = useState(false);

    const onKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            onChange(event);
        }
    };
    const onChange = (event: any) => {
        let value = event.target.value;

        setEditable(false);

        if (!value) {
            return;
        }

        value = parseInt(value, 10);

        if (!isFinite(value)) {
            return;
        }

        if (!!props.max && props.max < value) {
            props.onChange(props.max);
            return;
        }

        props.onChange(value);
    };

    if (!isEditable) {
        return (
            <span className={classes.number} onClick={() => setEditable(true)}>
                <span>{props.current}</span>
            </span>
        );
    }

    return (
        <span className={classes.numberValue}>
            <input
                type="number"
                max={props.max}
                min={0}
                defaultValue={props.current}
                autoFocus
                onKeyDown={onKeyDown}
                onBlur={onChange}
            />
        </span>
    )
}
