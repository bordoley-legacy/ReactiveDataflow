/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

import * as CounterViewProvider from './counter/view';
import * as CounterStoreProvider from './stores/counter';

import * as GoogleSearchViewProvider from './google-search/view';
import * as GoogleSearchStoreProvider from './stores/google-search';

import * as MainPageViewProvider from './main-page/view';

import * as NavigatorViewProvider from './navigator/view';

import * as FaceboodFeedViewProvider from './facebook-feed/view';
import * as FacebookLoginStoreProvider from './stores/facebook-login';
import * as FacebookFeedStore from './stores/facebook-feed';

import * as React from 'react';

import ReactiveDataflowComponent from 'reactive-dataflow-react';

import * as ApplicationModelProvider from './ApplicationModel';

import type { UIComponents } from './ui-components';
import type { ApplicationPage } from './ApplicationModel';

export const create = (uiComponents: UIComponents) => {
  const counterStore = CounterStoreProvider.create(0);
  const googleSearchStore = GoogleSearchStoreProvider.create(10);
  const facebookLoginStore = FacebookLoginStoreProvider.create();
  const facebookFeedStore = FacebookFeedStore.create;

  const model = ApplicationModelProvider.create(
    counterStore,
    googleSearchStore,
    facebookLoginStore,
    facebookFeedStore,
  );

  const CounterView = CounterViewProvider.create(uiComponents);
  const GoogleSearchView = GoogleSearchViewProvider.create(uiComponents);
  const MainPageView = MainPageViewProvider.create(uiComponents);
  const NavigatorView = NavigatorViewProvider.create(uiComponents);
  const FacebookFeedView = FaceboodFeedViewProvider.create(uiComponents);

  const renderScene = (props: ApplicationPage) => (
      props.tag === 'counter'       ? <ReactiveDataflowComponent render={ CounterView } source={ props.props } />
    : props.tag === 'google-search' ? <ReactiveDataflowComponent render={ GoogleSearchView } source={ props.props } />
    : props.tag === 'mainpage'      ? <MainPageView { ...props.props } />
    : props.tag === 'navigator'     ? <NavigatorView { ...props.props } />
    : props.tag === 'facebook-feed' ? <ReactiveDataflowComponent render={ FacebookFeedView } source={ props.props } />
    : () => null
  );

  const { Navigator } = uiComponents;

  const NavigatorComponent = props => (
    <Navigator
      goBack={ props.goBack }
      goUp={ props.goUp }
      navigationStack={ props.values }
      renderScene={ renderScene }
    />
  );

  return (
    <ReactiveDataflowComponent
      render={ NavigatorComponent }
      source={ model }
    />
  );
};
