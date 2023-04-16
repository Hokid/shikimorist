import React, {Component} from 'react'
import {AddAnimeToListScreen} from './screens/add-to-list/AddAnimeToListScreen';
import {RateControlScreen} from './screens/rate-control/RateControlScreen';
import {EmptyResultScreen} from './screens/empty/EmptyResultScreen';
import {LoaderScreen} from './screens/loader/Loader';
import {ErrorScreen} from './screens/error/Error';
import {SignInScreen} from './screens/sign-in/SignInScreen';
import {MainState} from './states/Main';
import {inject, observer} from 'mobx-react';
import {SearchingScreen} from './screens/searching/SearchingScreen';
import {MenuScreen} from './screens/menu/MenuScreen';
import {Screens} from './states/types';
import {VoidScreen} from './screens/void/Void';
import { SupportedResources } from './screens/supported-resources/SupportedResources';


type Props = {
    mainStore?: MainState;
};

@inject('mainStore')
@observer
export class ScreensView extends Component<Props> {
    async componentDidMount() {
        await this.props.mainStore!.initialize();
    }

    render() {
        switch (this.props.mainStore!.screens.current) {
            case Screens.SIGN_IN:
                return <SignInScreen/>;
            case Screens.EMPTY:
                return <EmptyResultScreen/>;
            case Screens.ADD_TO_LIST:
                return <AddAnimeToListScreen/>;
            case Screens.ERROR:
                return <ErrorScreen/>;
            case Screens.RATE_CONTROL:
                return <RateControlScreen/>;
            case Screens.MENU:
                return <MenuScreen/>;
            case Screens.SEARCHING:
                return <SearchingScreen/>;
            case Screens.LOADER:
                return <LoaderScreen/>;
            case Screens.SUPPORTED_RESOURCES:
                return <SupportedResources/>;
            default:
                return <VoidScreen/>;
        }
    }
}
