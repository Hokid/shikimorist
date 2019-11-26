import React from 'react';
import logo from './logo.png';

type Props = {}

export function VoidScreen(props: Props) {
    return (
        <div
            style={{
                height: '100%',
                backgroundImage: `url(${logo})`,
                backgroundPosition: 'center center',
                backgroundSize: '50%',
                backgroundRepeat: 'no-repeat'
            }}
        />
    );
}
