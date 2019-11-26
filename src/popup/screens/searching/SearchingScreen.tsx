import React, {useEffect} from 'react';
import {IAnime} from '../../../core/api/animes';
import debounce from 'lodash/debounce';
import {getAnimeName} from '../../../core/utils';
import classes from './Searching.module.css';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {inject, observer} from 'mobx-react';
import {MainState} from '../../states/Main';
import {SearchingState} from '../../states/Searching';
import {ScreenState} from '../../states/Screen';

type Props = {
    screenState?: ScreenState;
    searchingState?: SearchingState;
}

export function View(props: Props) {
    const onSearch = debounce((value: string) => {
        props.searchingState!.search(value);
    }, 1000);
    const onSelect = (anime: IAnime) => () => {
        props.searchingState!.onSelect(anime);
    };

    useEffect(() => {
        props.searchingState!.search();
    }, []);

    return (
        <WithSideLayout
            side="left"
            sideChildren={
                <BackSideButton
                    onBack={() => props.screenState!.goBack()}
                />
            }
        >
            <div className={classes.root}>
                <div className={classes.inputWrapper}>
                    <input
                        className={classes.input}
                        defaultValue={props.searchingState!.defaultSearchQuery}
                        autoFocus
                        type="text"
                        placeholder="Поиск"
                        onChange={(event: any) => onSearch(event.target.value)}
                    />
                </div>
                <div className={classes.listWrapper}>
                    {
                        props.searchingState!.isSearching && ('Поиск...')
                    }
                    <ul className={classes.list}>
                        {
                            !!props.searchingState!.result && (
                                props.searchingState!.result.map(_ => (
                                    <li key={_.id} className={classes.listItem}>
                                        <button onClick={onSelect(_)} title={getAnimeName(_)}>
                                            {cutString(getAnimeName(_), 53)}
                                        </button>
                                    </li>
                                ))
                            )
                        }
                    </ul>
                </div>
            </div>
        </WithSideLayout>
    );
}

export const SearchingScreen = inject(
    (states: { mainStore: MainState }) => ({
        searchingState: states.mainStore.searching,
        screenState: states.mainStore.screens,
    })
)(observer(View));


function cutString(str: string, max: number): string {
    if (max < 0) {
        return '';
    }

    if (str.length <= max) {
        return str;
    }

    return str.slice(0, max > 3 ? max - 3 : 0) + '...';
}
