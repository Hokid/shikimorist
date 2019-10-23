import React from 'react';
import {RateStatus} from '../../../../../core/api/usersRate';
import classes from './List.module.css';


const listOptions = [
    {value: RateStatus.planned, label: 'Запланировано'},
    {value: RateStatus.watching, label: 'Смотрю'},
    {value: RateStatus.completed, label: 'Просмотрено'},
    {value: RateStatus.on_hold, label: 'Отложено'},
    {value: RateStatus.dropped, label: 'Брошено'},
    {value: RateStatus.rewatching, label: 'Пересматриваю'},
];

type Props = {
    selected?: RateStatus | null;
    onSelect(value: RateStatus): any;
    onDelete?(): any;
}

export function List(props: Props) {
    return (
        <ul className={classes.list}>
            {
                listOptions.map(_ => (
                    <li
                        key={_.value}
                        className={`${classes.option} ${_.value === props.selected ? classes.selected : ''}`}
                    >
                        <button
                            onClick={
                                () => props.onSelect(_.value)
                            }
                        >{_.label}</button>
                    </li>
                ))
            }
            {
                !!props.onDelete && (
                    <li
                        className={`${classes.option} ${classes.delete}`}
                    >
                        <button
                            onClick={props.onDelete}
                        >Удалить из списка</button>
                    </li>
                )
            }
        </ul>
    );
}
