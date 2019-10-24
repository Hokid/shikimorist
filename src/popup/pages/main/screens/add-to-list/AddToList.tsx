import React, {useState} from 'react';
import {RateStatus} from '../../../../../core/api/usersRate';
import {List} from '../../elements/list/List';
import {WithSideLayout} from '../../layout/with-side/WithSide';
import {BackSideButton} from '../../elements/back-side-button/BackSideButton';
import {Menu} from '../menu/Menu';
import {Button} from '../../elements/buttons/Button';
import {IAnime} from '../../../../../core/api/animes';
import {getAnimeName} from '../../../../../core/utils';

const listOptions = Object.values(RateStatus);

type Props = {
    onAdd(value: RateStatus): any;
    anime: IAnime;
}


export function AddToList(props: Props) {
    const [open, setOpen] = useState(false);

    const onChangeList = (value: RateStatus) => {
        props.onAdd(value);
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

    const name = getAnimeName(props.anime);

    return (
        <div style={{height: '100%'}}>
            <Menu/>
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
                    >{name}</p>
                    <Button onClick={onOpenList}>Добавить в список</Button>
                </div>
            </div>
        </div>
    );
}
