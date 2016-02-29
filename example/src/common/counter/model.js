/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

import * as RxModels from 'reactive-dataflow-models';

import type { Command } from 'reactive-dataflow-models';
import type { CounterStore } from '../stores/counter';

export type CounterModel = {
  count: number;
  incrementCountBy1: Command;
  incrementCountBy4: Command;
};

export const create = (
  countStore: CounterStore,
): any /* FIXME: Observable<CounterModel> */ =>
  countStore.state.map(count => ({
    count,
    incrementCountBy1: RxModels.createCommand(
      () => countStore.setCount(1 + count),
    ),
    incrementCountBy4: RxModels.createCommand(
      () => countStore.setCount(4 + count),
    ),
  }));
