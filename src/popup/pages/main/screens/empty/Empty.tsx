import React from 'react';
import background from './background.png';
import {Menu} from '../menu/Menu';


type Props = {}

export function Empty(props: Props) {
    return (
        <div
            style={{
                height: '100%',
                textAlign: 'center',
                paddingTop: 30
            }}
        >
            <Menu/>
            <img src={background} height="130" alt="empty"/>
            <p
                style={{
                    fontSize: 16,
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    color: '#a2a2a2'
                }}
            >
                Тут ничего нет
            </p>
        </div>
    );
}
