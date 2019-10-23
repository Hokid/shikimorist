import React, {ReactNode} from 'react';

type Props = {
    children?: ReactNode;
    side: 'left' | 'right';
    sideChildren: ReactNode;
}

export function WithSideLayout(props: Props) {
    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
            }}
        >
            {
                props.side === 'left' && (
                    <div
                        style={{
                            flexGrow: 0
                        }}
                    >
                        {props.sideChildren}
                    </div>
                )
            }
            <div
                style={{
                    flexGrow: 1
                }}
            >
                {props.children}
            </div>
            {
                props.side === 'right' && (
                    <div
                        style={{
                            flexGrow: 0
                        }}
                    >
                        {props.sideChildren}
                    </div>
                )
            }
        </div>
    );
}
