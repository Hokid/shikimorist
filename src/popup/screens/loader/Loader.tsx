import React from 'react';
import loader from './loader.gif';
type Props = {}

export function LoaderScreen(props: Props) {
    return (
        <div
            style={{
                height: '100%',
                backgroundImage: `url(${loader})`,
                backgroundPosition: 'center center',
                backgroundSize: '50%',
                backgroundRepeat: 'no-repeat'
            }}
        />
    );
}
