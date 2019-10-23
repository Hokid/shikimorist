import React, {useEffect, useState} from 'react';
import {IRate, RateStatus} from '../../../../../core/api/usersRate';

const listOptions = Object.values(RateStatus);
const scoreOptions = [0,1,2,3,4,5,6,7,8,9,10];

type Props = {
    value: {
        episodes: number;
        score: number;
        rewatches: number;
        status: RateStatus;
    };
    onChangeStatus(status: RateStatus): any;
    onChangeScore(score: number): any;
    onChangeRewatches(rewatches: number): any;
    onIncrementEp(): any;
    onDecrementEp(): any;
}

export function RateControl(props: Props) {
    return (
        <div>
            <p>
                Эпизоды
                <div>
                    <button onClick={props.onDecrementEp}>-</button>
                    {props.value.episodes}
                    <button onClick={props.onIncrementEp}>+</button>
                </div>
            </p>
            <p>
                Список
                <div>
                    <select
                        value={props.value.status}
                        onChange={(event: any) => props.onChangeStatus(event.target.value)}
                    >
                        {
                            listOptions.map(_ => (
                                <option value={_}>{_}</option>
                            ))
                        }
                    </select>
                </div>
            </p>
            <p>
                Оценка
                <div>
                    <select
                        value={props.value.score}
                        onChange={(event: any) => props.onChangeScore(event.target.value)}
                    >
                        {
                            scoreOptions.map(_ => (
                                <option value={_}>{_}</option>
                            ))
                        }
                    </select>
                </div>
            </p>
            <p>
                Кол-во пересмотренных раз
                <div>
                    <input
                        type="number"
                        value={props.value.rewatches}
                        onChange={(event: any) => props.onChangeRewatches(event.target.value)}
                    />
                </div>
            </p>
        </div>
    );
}
