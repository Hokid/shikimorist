import React from 'react';
import {MenuButton} from './elements/MenuButton';
import {inject, observer} from 'mobx-react';
import {MainState} from '../../states/Main';
import {ScreenState} from '../../states/Screen';
import {Screens} from '../../states/types';

type Props = {
    screenState?: ScreenState;
}

export function View(props: Props) {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0
        }}>
            <MenuButton
                onClick={() => props.screenState!.push(Screens.MENU)}
            />
        </div>
    );
}

export const MenuToggler = inject(
    (states: { mainStore: MainState }) => ({
        screenState: states.mainStore.screens
    })
)(observer(View));
