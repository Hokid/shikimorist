import React, {useState} from 'react';
import {RateStatus} from '../../../../../core/api/usersRate';
import {List} from '../../elements/list/List';
import {WithHeaderLayout} from '../../layout/with-header/WithHeader';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';

const listOptions = Object.values(RateStatus);

type Props = {
    onAdd(value: RateStatus): any
}


export function AddToList(props: Props) {
    const [chooseList, setChooseList] = useState(false);

    const onChangeList = (value: RateStatus) => {
        props.onAdd(value);
    };
    const onBack = () => {
        setChooseList(false)
    };
    const onOpenList = () => {
        setChooseList(true)
    };

    if (chooseList) {
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

    return (
        <WithHeaderLayout>
            <button onClick={onOpenList}>Добавить в список</button>
        </WithHeaderLayout>
    );
}
