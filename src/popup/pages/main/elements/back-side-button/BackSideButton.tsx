import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {SideButton} from '../side-button/SideButton';

type Props = {
    onBack(): any;
}

export function BackSideButton(props: Props) {
    return (
        <SideButton
            onClick={props.onBack}
            icon={
                <FontAwesomeIcon
                    icon="chevron-left"
                    color="inherit"
                />
            }
        />
    );
}
