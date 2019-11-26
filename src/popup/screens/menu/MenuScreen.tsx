import React from 'react';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {Button} from '../../elements/buttons/Button';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';
import {inject, observer} from 'mobx-react';
import {MainState} from '../../states/Main';
import {ScreenState} from '../../states/Screen';
import {AuthorizationState} from '../../states/Authorization';
import {Screens} from '../../states/types';

type Props = {
    screenState?: ScreenState;
    authState?: AuthorizationState;
}

export function View(props: Props) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                zIndex: 2,
                background: '#ffffff'
            }}
        >
            <WithSideLayout
                side="left"
                sideChildren={
                    <BackSideButton
                        onBack={() => props.screenState!.goBack()}
                    />
                }
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%'
                    }}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '12px 24px',
                            flexGrow: 1
                        }}
                    >
                        {
                            props.authState!.isAuthorized && (
                                <Button
                                    onClick={() => props.screenState!.push(Screens.SEARCHING)}
                                    style={{
                                        width: '100%',
                                        background: '#161616'
                                    }}
                                >Найти аниме</Button>
                            )
                        }
                        {
                            props.authState!.isAuthorized && (
                                <Button
                                    onClick={() => props.authState!.signOut()}
                                    style={{
                                        width: '100%',
                                        marginTop: 12,
                                        background: '#161616'
                                    }}
                                >Выход</Button>
                            )
                        }
                    </div>
                    <div
                        style={{
                            flexGrow: 0,
                            padding: '12px 12px',
                        }}
                    >
                        <p>Заметили ошибку или есть вопросы, предложения?</p>
                        <a href="mailto:mr.hokid@gmail.com?subject=shikimirist" target="_blank">mr.hokid@gmail.com</a>
                    </div>
                </div>
            </WithSideLayout>
        </div>
    );
}

export const MenuScreen = inject(
    (states: { mainStore: MainState }) => ({
        screenState: states.mainStore.screens,
        authState: states.mainStore.authorization,
    })
)(observer(View));
