import React, { useMemo } from 'react';
import classes from './SupportedResources.module.css';
import { BackSideButton } from '../../elements/back-side-button/BackSideButton';
import { WithSideLayout } from '../../layout/with-side/WithSide';
import { inject, observer } from 'mobx-react';
import { MainState } from '../../states/Main';
import { ScreenState } from '../../states/Screen';
import { parsers } from '../../../core/parser';

type Props = {
  screenState?: ScreenState;
}

export function View(props: Props) {
  const list = useMemo<{ url: string, title: string }[]>(() => {
    const result = parsers.reduce((out, parser) => {
      out = out.concat(parser.hosts.map(host => ({
        url: host.url, title: host.url + (host.vpn ? ' (VPN)' : '')
      })));
      return out;
    }, [] as { url: string, title: string }[]);
    return result;
  }, []);
  return (<WithSideLayout
    side="left"
    sideChildren={<BackSideButton
      onBack={() => props.screenState!.goBack()}
    />}
  >
    <div className={classes.root}>
      <ol>
        {list.map(({url, title}) => (<li
          key={url}
        >
          <a href={url} target="_blank">{title}</a>
        </li>))}
      </ol>
    </div>
  </WithSideLayout>);
}

export const SupportedResources = inject((states: { mainStore: MainState }) => ({
  screenState: states.mainStore.screens,
}))(observer(View));
