import React, {ReactNode, useContext} from 'react';
import {authContext} from '../../../../contexts/Authorization';

type Props = {
    children?: ReactNode;
}

export function WithHeaderLayout(props: Props) {
    const context = useContext(authContext);

    return (
        <div>
            <div
                style={{
                    height: 24
                }}
            >
                {
                    context.isAuthorized && (
                        <button onClick={context.signOut}>Выйти</button>
                    )
                }
            </div>
            <div
                style={{
                    height: 'calc(100% - 24px)'
                }}
            >
                {props.children}
            </div>
        </div>
    );
}
