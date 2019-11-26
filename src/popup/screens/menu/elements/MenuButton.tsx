import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

type Props = {
    onClick(): any;
}

export function MenuButton(props: Props) {
    return (
        <button
            style={{
                background: '#000000',
                outline: 'none',
                verticalAlign: 'top',
                border: 0,
                borderBottomRightRadius: '10px',
                cursor: 'pointer',
                width: 24,
                height: 24,
            }}
            onClick={props.onClick}
        >
            <FontAwesomeIcon
                icon="bars"
                color="#ffffff"
                size="sm"
            />
        </button>
    );
}
