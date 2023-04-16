import React from 'react';
import background from './background.png';
import {MenuScreen} from '../menu/MenuScreen';
import {inject, observer} from 'mobx-react';
import {MainState} from '../../states/Main';
import {ScreenState} from '../../states/Screen';
import {Screens} from '../../states/types';
import {MenuToggler} from '../menu/Toggler';
import {Button} from '../../elements/buttons/Button';


type Props = {
    screenState?: ScreenState;
}

function View(props: Props) {
    return (
        <div
            style={{
                height: '100%',
                textAlign: 'center',
                paddingTop: 30
            }}
        >
            <MenuToggler/>
            <img src={background} height="130" alt="empty"/>
            <p
                style={{
                    fontSize: 12,
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    color: '#a2a2a2',
                    marginTop: 6,
                    marginBottom: 3
                }}
            >
                Похоже, что сайт не поддерживается, или вы не на странице с аниме.
            </p>
            <div style={{textAlign: 'center'}}>
                <Button
                    theme="link"
                    onClick={() => props.screenState!.push(Screens.SEARCHING)}
                >Поиск аниме</Button>
            </div>
            <div style={{textAlign: 'center'}}>
              <Button
                theme="link"
                onClick={() => props.screenState!.push(Screens.SUPPORTED_RESOURCES)}
              >Список сайтов</Button>
            </div>

        </div>
    );
}

export const EmptyResultScreen = inject(
    (states: { mainStore: MainState }) => ({
        screenState: states.mainStore.screens
    })
)(observer(View));
