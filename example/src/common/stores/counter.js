/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

import * as Rx from 'rx';

export type CounterStore = {
  state: any;
  setCount: (value: number) => void;
}

export const create = (
  initialCount: number,
): CounterStore => {
  const countState = new Rx.BehaviorSubject(initialCount);

  return {
    state: countState.asObservable(),
    setCount: value => countState.onNext(value),
  };
};
