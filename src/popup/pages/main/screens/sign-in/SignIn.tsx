import React, {useContext} from 'react';
import {authContext} from '../../../../contexts/Authorization';
import {Button} from '../../elements/buttons/Button';
import background from './background.png';

type Props = {}

export function SignIn(props: Props) {
    const auth = useContext(authContext);

    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <img src={background} height="130" alt=""/>
            <Button
                onClick={auth.signIn}
            >Войти</Button>
        </div>
    );
}
