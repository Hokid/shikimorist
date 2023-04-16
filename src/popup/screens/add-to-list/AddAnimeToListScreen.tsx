import React, {useState} from 'react';
import {RateStatus} from '../../../core/api/usersRate';
import {List} from '../../elements/list/List';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';
import {Button} from '../../elements/buttons/Button';
import {getAnimeName} from '../../../core/utils';
import {inject, observer} from 'mobx-react';
import {MainState} from '../../states/Main';
import {ScreenState} from '../../states/Screen';
import {AnimeState} from '../../states/Anime';
import {MenuToggler} from '../menu/Toggler';
import {Screens} from '../../states/types';
import {AnimeLinkableTitle} from '../../elements/anime-linkable-title/AnimeLikableTitle';


type Props = {
    screenState?: ScreenState;
    animeState?: AnimeState;
}

export function View(props: Props) {
    const [open, setOpen] = useState(false);

    const onChangeList = async (value: RateStatus) => {
        await props.animeState!.addAnimeToRateList(value);
    };
    const onBack = () => {
        setOpen(false)
    };
    const onOpenList = () => {
        setOpen(true)
    };

    if (open) {
        return (
            <WithSideLayout
                side="left"
                sideChildren={
                    <BackSideButton
                        onBack={onBack}
                    />
                }
            >
                <List
                    onSelect={onChangeList}
                />
            </WithSideLayout>
        )
    }

    if (!props.animeState!.anime) {
        return null;
    }

    const name = getAnimeName(props.animeState!.anime);

    return (
        <div style={{height: '100%'}}>
            <MenuToggler/>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div style={{textAlign: 'center'}}>
                    <p
                        style={{
                            padding: '12px 20px',
                            margin: 0,
                        }}
                    >
                        <AnimeLinkableTitle
                            russianName={props.animeState!.anime.russian}
                            name={props.animeState!.anime.name}
                            shikimoriHost={props.animeState!.shikimoriHost}
                            path={props.animeState!.anime.url}
                        />
                    </p>
                    <Button onClick={onOpenList}>Добавить в список</Button>
                    <div style={{textAlign: 'center', marginTop: 3}}>
                        <Button
                            theme="link"
                            onClick={() => props.screenState!.push(Screens.SEARCHING)}
                        >Ручной поиск</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const AddAnimeToListScreen = inject(
    (states: { mainStore: MainState }) => ({
        animeState: states.mainStore.anime,
        screenState: states.mainStore.screens,
    })
)(observer(View));
