import React from 'react';
import {Button} from '../../elements/buttons/Button';
import background from './background.png';
import {inject, observer} from 'mobx-react';
import {MainState} from '../../states/Main';
import {ScreenState} from '../../states/Screen';
import {AuthorizationState} from '../../states/Authorization';

type Props = {
    authState?: AuthorizationState;
}

export function View(props: Props) {
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
                onClick={() => props.authState!.signIn()}
            >Войти</Button>
        </div>
    );
}

export const SignInScreen = inject(
    (states: { mainStore: MainState }) => ({
        authState: states.mainStore.authorization,
    })
)(observer(View));
