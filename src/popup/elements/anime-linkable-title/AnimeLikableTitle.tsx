import React, {useMemo} from 'react';


export type AnimeLinkableTitleProps = {
    russianName?: string | null;
    name: string;
    shikimoriHost: string;
    path: string;
}

export function AnimeLinkableTitle(props: AnimeLinkableTitleProps) {
    const name = useMemo(
        () => getAnimeName(props.name, props.russianName),
        [
            props.russianName,
            props.name
        ]
    );

    const link = useMemo(
        () => `${props.shikimoriHost}${props.path}`,
        [
            props.shikimoriHost,
            props.path
        ]
    );

    return (
        <a
            style={{
                display: 'block',
                color: '#000000',
            }}
            title={name}
            href={link}
            target="_blank"
        >
            {name}
        </a>
    )
}

function getAnimeName(name: string, russian?: string | null): string {
    if (russian) {
        name = russian + ' / ' + name;
    }

    if (name.length > 218) {
        name = name.slice(0, 218) + '...';
    }

    return name;
}
