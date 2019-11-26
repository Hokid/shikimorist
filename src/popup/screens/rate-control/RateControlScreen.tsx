import React, {useState} from 'react';
import {RateStatus} from '../../../core/api/usersRate';
import {Rate} from './elements/Rate';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {ListSideButton} from '../../elements/list-side-button/ListSideButton';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';
import {List} from '../../elements/list/List';
import {Counter} from '../../elements/counter/Counter';
import {IAnime} from '../../../core/api/animes';
import {getAnimeName} from '../../../core/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {inject, observer} from 'mobx-react';
import {MainState} from '../../states/Main';
import {AnimeState} from '../../states/Anime';
import {MenuToggler} from '../menu/Toggler';

type Props = {
    animeState?: AnimeState;
}

export function View(props: Props) {
    const [listOpen, setListOpen] = useState(false);

    if (listOpen) {
        return (
            <WithSideLayout
                side="left"
                sideChildren={
                    <BackSideButton
                        onBack={() => setListOpen(false)}
                    />
                }
            >
                <List
                    selected={props.animeState!.rate!.status}
                    onSelect={status => props.animeState!.setRateStatus(status)}
                    onDelete={() => props.animeState!.removeAnimeFromRateList()}
                />
            </WithSideLayout>
        );
    }

    return (
        <WithSideLayout
            side="right"
            sideChildren={
                <ListSideButton
                    disabled={props.animeState!.isRateUpdating}
                    onList={() => setListOpen(true)}
                />
            }
        >
            <MenuToggler/>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <div
                    style={{
                        flexGrow: 1
                    }}
                >
                    <Title
                        anime={props.animeState!.anime!}
                        shikimoriHost={props.animeState!.shikimoriHost}
                    />
                    <Details
                        anime={props.animeState!.anime!}
                    />
                    <div style={{height: 12}}/>
                    <Field label="Эпизоды">
                        <Counter
                            onDown={() => props.animeState!.decrementRateEpisodes()}
                            onUp={() => props.animeState!.incrementRateEpisodes()}
                            onChange={ep => props.animeState!.setRateEpisodes(ep)}
                            loading={props.animeState!.isRateUpdating}
                            current={props.animeState!.rate!.episodes}
                            max={props.animeState!.anime!.episodes}
                        />
                    </Field>
                    {
                        props.animeState!.rate!.status === RateStatus.rewatching && (
                            <Field label="Пересмотренно">
                                <Counter
                                    onDown={() => props.animeState!.decrementRateRewatches()}
                                    onUp={() => props.animeState!.incrementRateRewatches()}
                                    loading={props.animeState!.isRateUpdating}
                                    onChange={r => props.animeState!.setRateRewatches(r)}
                                    current={props.animeState!.rate!.rewatches}
                                />
                            </Field>
                        )
                    }
                </div>
                <div
                    style={{
                        flexGrow: 0,
                        textAlign: 'center',
                        padding: '12px 12px'
                    }}
                >
                    <Rate
                        value={props.animeState!.rate!.score}
                        onChange={s => props.animeState!.setRateScore(s)}
                    />
                </div>
            </div>
        </WithSideLayout>
    );
}

export const RateControlScreen = inject(
    (states: { mainStore: MainState }) => ({
        animeState: states.mainStore.anime
    })
)(observer(View));

function Field(
    props: {
        label: string,
        children?: React.ReactNode
    }
) {
    return (
        <div
            style={{
                color: '#000000',
                padding: '12px 12px 12px 18px',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <span
                style={{
                    flexGrow: 1,
                    paddingRight: 12
                }}
            >{props.label}</span>
            <div
                style={{
                    width: 112,
                    flexGrow: 0
                }}
            >{props.children}</div>
        </div>
    )
}

type TitleProps = {
    anime: IAnime;
    shikimoriHost: string;
}

function Title(props: TitleProps) {
    return (
        <a
            style={{
                display: 'block',
                padding: '0 12px 0 45px',
                lineHeight: '24px',
                color: '#000000',
                overflow: 'hidden',
                textAlign: 'right',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: 193
            }}
            title={getAnimeName(props.anime)}
            href={`${props.shikimoriHost}${props.anime.url}`}
            target="_blank"
        >
            {getAnimeName(props.anime)}
        </a>
    )
}

type DetailsProps = {
    anime: IAnime;
}

function Details(props: DetailsProps) {
    return (
        <div style={{
            textAlign: 'right',
            paddingRight: 12
        }}>

            <span>
                <FontAwesomeIcon
                    icon="list-alt"
                    size="xs"
                    color="inherit"
                    style={{marginRight: 3}}
                />
                {props.anime.episodes}
            </span>
            <span style={{marginLeft: 12}}>
                <FontAwesomeIcon
                    icon="star"
                    size="sm"
                    color="inherit"
                    style={{marginRight: 3}}
                />
                {props.anime.score}
            </span>
        </div>
    )
}
