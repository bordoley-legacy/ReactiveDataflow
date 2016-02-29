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

export type MainPageModel = {
  openGoogleSearch: Command;
  openCounter: Command;
  openNavigator: Command;
  openFacebookFeed: Command;
}

export const create = (
  openGoogleSearch: () => void,
  openCounter: () => void,
  openNavigator: () => void,
  openFacebookFeed: () => void,
): MainPageModel => ({
  openGoogleSearch: RxModels.createCommand(openGoogleSearch),
  openCounter: RxModels.createCommand(openCounter),
  openNavigator: RxModels.createCommand(openNavigator),
  openFacebookFeed: RxModels.createCommand(openFacebookFeed),
});
