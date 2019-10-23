import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {SideButton} from '../side-button/SideButton';

type Props = {
    onList(): any;
}

export function ListSideButton(props: Props) {
    return (
        <SideButton
            onClick={props.onList}
            icon={
                <FontAwesomeIcon
                    icon="list"
                    color="inherit"
                />
            }
        />
    );
}
