import React, {useContext, useState} from 'react';
import {authContext} from '../../../../contexts/Authorization';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {Button} from '../../elements/buttons/Button';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';
import {MenuButton} from './elements/MenuButton';

type Props = {}

export function Menu(props: Props) {
    const [open, setOpen] = useState(false);
    const auth = useContext(authContext);

    if (open) {
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
                            onBack={() => setOpen(false)}
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
                                auth.isAuthorized && (
                                    <Button
                                        onClick={auth.signOut}
                                        style={{
                                            width: '100%',
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

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0
        }}>
            <MenuButton
                onClick={() => setOpen(true)}
            />
        </div>
    );
}
