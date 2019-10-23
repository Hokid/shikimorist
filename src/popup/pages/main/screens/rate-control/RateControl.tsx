import React, {useState} from 'react';
import {RateStatus} from '../../../../../core/api/usersRate';
import {Rate} from './elements/Rate';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {ListSideButton} from '../../elements/list-side-button/ListSideButton';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';
import {List} from '../../elements/list/List';
import {Counter} from '../../elements/counter/Counter';

const listOptions = Object.values(RateStatus);
const scoreOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Props = {
    value: {
        episodes: number;
        score: number;
        rewatches: number;
        status: RateStatus;
    };
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
                    {
                        props.value.status === RateStatus.rewatching && (
                            <>
                                <p style={{textAlign: 'center'}}>Пересмотренно</p>
                                <Counter
                                    onDown={() => props.onChangeRewatches(props.value.rewatches - 1)}
                                    onUp={() => props.onChangeRewatches(props.value.rewatches + 1)}
                                    loading={props.updating}
                                    current={props.value.rewatches}
                                />
                                <div style={{height: 12}}/>
                            </>
                        )
                    }
                    <p style={{textAlign: 'center'}}>Эпизоды</p>
                    <Counter
                        onDown={props.onDecrementEp}
                        onUp={props.onIncrementEp}
                        loading={props.updating}
                        current={props.value.episodes}
                        max={props.maxEpisodes}
                    />
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
