import React from 'react';
import background from './background.png';
import {Button} from '../../elements/buttons/Button';
import {ErrorState} from '../../states/Error';
import {inject, observer} from 'mobx-react';
import {MainState} from '../../states/Main';

type Props = {
    errorState?: ErrorState;
};

function View(props: Props) {
    return (
        <div
            style={{
                height: '100%',
                textAlign: 'center',
                paddingTop: 16,
                boxSizing: 'border-box',
            }}
        >
            <img src={background} height="120" style={{verticalAlign: 'top'}} alt="error"/>
            <p
                style={{
                    fontSize: 14,
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    color: '#a2a2a2',
                    marginTop: 6,
                    marginBottom: 3
                }}
            >
                Ошибка
            </p>
            <div
                style={{
                    textAlign: 'center',
                }}
            >
                {
                    !!props.errorState!.repeater && (
                        <Button
                            onClick={props.errorState!.repeater}
                        >Повторить</Button>
                    )
                }
            </div>
        </div>
    );
}

export const ErrorScreen = inject(
    (states: { mainStore: MainState }) => ({
        errorState: states.mainStore.error
    })
)(observer(View));
