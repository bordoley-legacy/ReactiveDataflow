/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

'use strict';

export type Command = {
  canExecute: bool;
  execute: () => void;
};

export type Property<T> = {
  canUpdate: bool;
  update: (value: T) => void;
  value: T;
};

export const createCommand = (
  execute: () => void,
  canExecute: ?boolean,
): Command => {
  canExecute =
    (canExecute === null) || (canExecute === undefined) || canExecute;

  return {
    canExecute,
    execute: () => canExecute ? execute() : null,
  };
};

export const createProperty = function<T>(
  value: T,
  update: (value: T) => void,
  canUpdate: ?boolean,
): Property<T> {
  canUpdate =
    (canUpdate === null) || (canUpdate === undefined) || canUpdate;

  return {
    canUpdate,
    update: (value: T) => canUpdate ? update(value) : null,
    value,
  };
};
