import React, {useState} from 'react';
import {RateStatus} from '../../../../../core/api/usersRate';
import {Rate} from './elements/Rate';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {ListSideButton} from '../../elements/list-side-button/ListSideButton';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';
import {List} from '../../elements/list/List';
import {Counter} from '../../elements/counter/Counter';
import {Menu} from '../menu/Menu';
import {IAnime} from '../../../../../core/api/animes';
import {getAnimeName} from '../../../../../core/utils';

type Props = {
    value: {
        episodes: number;
        score: number;
        rewatches: number;
        status: RateStatus;
    };
    anime: IAnime;
    shikimoriHost: string;
    maxEpisodes: number;
    updating?: boolean;
    onChangeStatus(status: RateStatus): any;
    onChangeScore(score: number): any;
    onChangeRewatches(rewatches: number): any;
    onIncrementEp(): any;
    onDecrementEp(): any;
    onDelete(): any;
}

export function RateControl(props: Props) {
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
                    selected={props.value.status}
                    onSelect={props.onChangeStatus}
                    onDelete={props.onDelete}
                />
            </WithSideLayout>
        );
    }

    return (
        <WithSideLayout
            side="right"
            sideChildren={
                <ListSideButton
                    onList={() => setListOpen(true)}
                />
            }
        >
            <Menu/>
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
                    <a
                        style={{
                            display: 'block',
                            padding: '0 12px 0 45px',
                            lineHeight: '24px',
                            color: '#000000',
                            overflow: 'hidden',
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
                    <div style={{height: 12}}/>
                    {
                        props.value.status === RateStatus.rewatching && (
                            <Field label="Пересмотренно">
                                <Counter
                                    onDown={() => props.onChangeRewatches(props.value.rewatches - 1)}
                                    onUp={() => props.onChangeRewatches(props.value.rewatches + 1)}
                                    loading={props.updating}
                                    current={props.value.rewatches}
                                />
                            </Field>
                        )
                    }
                    <Field label="Эпизоды">
                        <Counter
                            onDown={props.onDecrementEp}
                            onUp={props.onIncrementEp}
                            loading={props.updating}
                            current={props.value.episodes}
                            max={props.maxEpisodes}
                        />
                    </Field>
                </div>
                <div
                    style={{
                        flexGrow: 0,
                        textAlign: 'center',
                        padding: '12px 12px'
                    }}
                >
                    <Rate
                        value={props.value.score}
                        onChange={props.onChangeScore}
                    />
                </div>
            </div>
        </WithSideLayout>
    );
}

function Field(
    props: {
        label: string,
        children?: React.ReactNode
    }
) {
    return (
        <div
            style={{
                margin: '0 0 6px',
                color: '#000000',
                padding: '12px 6px',
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
                    width: 120,
                    flexGrow: 0
                }}
            >{props.children}</div>
        </div>
    )
}
