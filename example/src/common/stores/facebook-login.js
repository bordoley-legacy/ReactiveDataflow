/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

declare function fetch(): Promise<any>;

import * as Rx from 'rx';

export type LoginState =
  'loading' | 'loggedOut' | 'loggedIn' | 'loggingIn';

const LoginStates = {
  'loading': 'loading',
  'loggedOut': 'loggedOut',
  'loggedIn': 'loggedIn',
  'loggingIn': 'loggingIn',
};

export type LoginStore = {
  state: any;
  doLogin: (apiKey: string) => Promise<boolean>;
  doLogout: () => void;
};

export const create = (): LoginStore => {
  const state = new Rx.BehaviorSubject({
    apiKey: '',
    loginState: LoginStates.loading,
  });

  // In the real world this would be asynchronously loading the
  // initial state from a db, kv store, etc.
  setTimeout(_ => {
    state.onNext({
      apiKey: '',
      loginState: LoginStates.loggedOut,
    });
  }, 500);

  return {
    state: state.asObservable(),

    doLogin: (apiKey: string) => fetch(`https://graph.facebook.com/v2.5/me?access_token=${apiKey}`)
      .then(response => response.json())
      .then(body => body.error
        ? false
        : (
          state.onNext({
            apiKey: apiKey,
            loginState: LoginStates.loggedIn,
          }),
          true
        )
      ),

    doLogout: () => {
      state.onNext({
        apiKey: '',
        loginState: LoginStates.loggedOut,
      });
    },
  };
};
