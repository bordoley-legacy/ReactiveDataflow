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
import * as Rx from 'rx';

import type { Command } from 'reactive-dataflow-models';

export type NavigatorModel = {
  page: number;
  open: Command;
  goBack: Command;
  goUp: Command;
}

export const create = (
  goBack: () => void,
  goUp: () => void,
  open: (model: NavigatorModel) => void,
): NavigatorModel => {
  const executeNavigationCommand = new Rx.Subject();

  // Note: Its safe to leak the subscription here.
  executeNavigationCommand.throttle(500 /* ms */).subscribe(command => command());

  const createNavigatorPage = (page: number) => ({
    page,
    open: RxModels.createCommand(() =>
      executeNavigationCommand.onNext(() =>
        open(createNavigatorPage(page + 1))
      ),
    ),

    goBack: RxModels.createCommand(() =>
      executeNavigationCommand.onNext(() => goBack()),
    ),

    goUp: RxModels.createCommand(() =>
      executeNavigationCommand.onNext(() => goUp()),
    ),
  });

  return createNavigatorPage(1);
};
