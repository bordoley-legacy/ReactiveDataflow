/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

import * as CounterModelProvider from './counter/model';
import * as GoogleSearchModelProvider from './google-search/model';
import * as MainPageModelProvider from './main-page/model';
import * as NavigatorModelProvider from './navigator/model';
import * as FacebookFeedModelProvider from './facebook-feed/model';
import * as NavigationStack from './stores/navigation';

import type { CounterStore } from './stores/counter';
import type { GoogleSearchStore } from './stores/google-search';
import type { LoginStore } from './stores/facebook-login';
import type { FacebookFeedStore } from './stores/facebook-feed';

import type { CounterModel } from './counter/model';
import type { GoogleSearchModel } from './google-search/model';
import type { MainPageModel } from './main-page/model';
import type { NavigatorModel } from './navigator/model';
import type { FacebookFeedModel } from './facebook-feed/model';

import type { NavigationController } from './stores/navigation';

export type ApplicationPage =
  { tag: 'counter';       props: CounterModel      } |
  { tag: 'google-search'; props: GoogleSearchModel } |
  { tag: 'mainpage';      props: MainPageModel     } |
  { tag: 'navigator';     props: NavigatorModel    } |
  { tag: 'facebook-feed'; props: FacebookFeedModel } ;

export const create = (
  counterStore: CounterStore,
  googleSearchStore: GoogleSearchStore,
  facebookLoginStore: LoginStore,
  facebookFeedStore: (apiKey: string) => FacebookFeedStore,
) => {
  const getInitialState = (spec: NavigationController) => {
    return {
      tag: 'mainpage',
      props: MainPageModelProvider.create(
        () => spec.open({
          tag: 'google-search',
          props: GoogleSearchModelProvider.create(googleSearchStore),
        }),
        () => spec.open({
          tag: 'counter',
          props: CounterModelProvider.create(counterStore),
        }),
        () => spec.open({
          tag: 'navigator',
          props: NavigatorModelProvider.create(
            spec.goBack,
            spec.goUp,
            model => spec.open({ tag: 'navigator', props: model }),
          ),
        }),
        () => spec.open({
          tag: 'facebook-feed',
          props: FacebookFeedModelProvider.create(
            facebookLoginStore,
            facebookFeedStore,
          ),
        }),
      ),
    };
  };

  return NavigationStack.create(getInitialState);
};
