import React from 'react';
import background from './background.png';
import {Button} from '../../elements/buttons/Button';
import {Menu} from '../menu/Menu';

type Props = {
    onUpdate(): any;
};

export function ErrorScreen(props: Props) {
    return (
        <div
            style={{
                height: '100%',
                textAlign: 'center',
                paddingTop: 30
            }}
        >
            <Menu/>
            <img src={background} height="120" alt="error"/>
            <p
                style={{
                    fontSize: 14,
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    color: '#a2a2a2'
                }}
            >
                Ошибка
            </p>
            <div
                style={{
                    textAlign: 'center',
                }}
            >
                <Button
                    onClick={props.onUpdate}
                >Обновить</Button>
            </div>
        </div>
    );
}
