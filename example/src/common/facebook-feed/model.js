/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

import * as Immutable from 'immutable';
import * as RxModels from 'reactive-dataflow-models';
import * as Rx from 'rx';

import type { Command, Property } from 'reactive-dataflow-models';
import type { FacebookFeedStore } from '../stores/facebook-feed';
import type { LoginStore } from '../stores/facebook-login';

export type LoggedOutPage = {
  apiKey: Property<string>;
  doLogin: Command;
  loginFailed: boolean;
  loggingIn: boolean;
};

export type FeedPage = {
  feed: Immutable.List<any>;
  loadMore: Command;
  refresh: Command;
  logOut: Command;
  logginOut: boolean;
};

export type FacebookFeedModel =
  { tag: 'loading';   props: void          } |
  { tag: 'loggedIn';  props: FeedPage      } |
  { tag: 'loggedOut'; props: LoggedOutPage } ;

// FIXME: Ideally all models would get injected with the global error handler as well
const createLoggedOutPageModel = (
  doLogin: (apiKey: string) => Promise<boolean>,
) => {
  const apiKeyState = new Rx.BehaviorSubject('');
  const loginFailedState = new Rx.BehaviorSubject(false);
  const loggingInState = new Rx.BehaviorSubject(false);

  return Rx.Observable.combineLatest(
    apiKeyState,
    loginFailedState,
    loggingInState,
  ).map(([apiKey, loginFailed, loggingIn]) => ({
    apiKey: RxModels.createProperty(
      apiKey,
      (key: string) => apiKeyState.onNext(key),
      !loggingIn,
    ),

    doLogin: RxModels.createCommand(
      () => {
        loggingInState.onNext(true);

        // FIXME: Should attach a global error handler to monitor this for errors.
        doLogin(apiKey).then(result => {
          loginFailedState.onNext(!result);
          loggingInState.onNext(false);
        });
      },
      apiKey.length > 0 && !loggingIn,
    ),

    loginFailed,

    loggingIn,
  }));
};

// FIXME: Ideally all models would get injected with the global error handler as well
const createFeedPageModel = (
  apiKey: string,
  doLogOut: () => void,
  feedStoreProvider: (apiKey: string) => FacebookFeedStore,
) => Rx.Observable.create(observer => {
  const canLoadMoreState = new Rx.BehaviorSubject(false);
  const canRefreshState = new Rx.BehaviorSubject(false);
  const loggingOutState = new Rx.BehaviorSubject(false);

  const feedStore = feedStoreProvider(apiKey);

  const subscription = Rx.Observable.combineLatest(
    feedStore.state,
    canLoadMoreState,
    canRefreshState,
    loggingOutState,
  ).map(([feed, canLoadMore, canRefresh, loggingOut]) => ({
    feed: feed,
    loadMore: RxModels.createCommand(
      () => {
        canLoadMoreState.onNext(false);

        // FIXME: Should attach a global error handler to monitor this for errors.
        feedStore.loadMore().then(_ => canLoadMoreState.onNext(true));
      },
      canLoadMore
    ),
    refresh: RxModels.createCommand(
      () => {
        canRefreshState.onNext(false);

        // FIXME: Should attach a global error handler to monitor this for errors.
        feedStore.refresh().then(_ => canRefreshState.onNext(true));
      },
      canRefresh,
    ),
    logOut: RxModels.createCommand(() => {
      canRefreshState.onNext(false);
      canLoadMoreState.onNext(false);
      loggingOutState.onNext(true);

      doLogOut();

      loggingOutState.onNext(false);
    }),
    logginOut: loggingOut,
  })).subscribe(observer);

  // FIXME: Should attach a global error handler to monitor this for errors.
  feedStore.loadMore().then(() => {
    canRefreshState.onNext(true);
    canLoadMoreState.onNext(true);
  });

  return () => {
    subscription.dispose();
    feedStore.dispose();
  };
});

// FIXME: Ideally all models would get injected with the global error handler as well
export const create = (
  loginStore: LoginStore,
  feedStoreProvider: (apiKey: string) => FacebookFeedStore,
): any => loginStore.state.map(state => (
    state.loginState === 'loading'  ? ['loading', Rx.Observable.of({})]
  : state.loginState === 'loggedIn' ? ['loggedIn', createFeedPageModel(state.apiKey, loginStore.doLogout, feedStoreProvider)]
  :                                   ['loggedOut', createLoggedOutPageModel(loginStore.doLogin)]
)).flatMapLatest(([tag, state]) =>
  state.map(props => ({ tag: tag, props: props }))
);
