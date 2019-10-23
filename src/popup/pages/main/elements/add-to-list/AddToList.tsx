import React, {useState} from 'react';
import {RateStatus} from '../../../../../core/api/usersRate';

const listOptions = Object.values(RateStatus);

type Props = {
    onAdd(): any
}


export function AddToList(props: Props) {
    const [chooseList, setChooseList] = useState(false);
    const [listName, setListName] = useState(RateStatus.planned);

    const onChangeList = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setListName(event.target.value as RateStatus)
    };
    const onBack = () => {
        setChooseList(false)
    };
    const onAdd = () => {
        setChooseList(true)
    };

    if (chooseList) {
        return (
            <div>
                <select
                    value={listName}
                    onChange={onChangeList}
                >
                    {
                        listOptions.map(_ => (
                            <option value={_}>{_}</option>
                        ))
                    }
                </select>
                <button onClick={onBack}>Назад</button>
                <button onClick={props.onAdd}>Сохранить</button>
            </div>
        )
    }

    return (
        <div>
            <button onClick={onAdd}>Добавить в список</button>
        </div>
    );
}
