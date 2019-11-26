import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {SideButton} from '../side-button/SideButton';

type Props = {
    onList(): any;
    disabled?: boolean;
}

export function ListSideButton(props: Props) {
    return (
        <SideButton
            onClick={props.onList}
            disabled={!!props.disabled}
            icon={
                <FontAwesomeIcon
                    icon="list"
                    color="inherit"
                />
            }
        />
    );
}
