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
import * as Rx from 'rx';
import * as RxModels from 'reactive-dataflow-models';

import type { Command } from 'reactive-dataflow-models';

export type NavigationController<T> = {
  goUp: () => void;
  setCanGoUp: (canGoUp: boolean) => void;

  goBack: () => void;
  setCanGoBack: (canGoBack: boolean) => void;

  open: (state: T) => void;
}

export type NavigationStack<T> = {
  values: Array<T>;
  goBack: Command;
  goUp: Command;
}

export const create = function<T>(
  getInitialState: (spec: NavigationController<T>) => T,
): any /* Observable<NavigationStack<T>>*/ {
  return Rx.Observable.create((observer) => {
    const goUpCommand = new Rx.Subject();
    const canGoUpState = new Rx.BehaviorSubject(true);

    const goBackCommand = new Rx.Subject();
    const canGoBackState = new Rx.BehaviorSubject(true);

    const openPageCommand = new Rx.Subject();

    const initialState = getInitialState({
      goUp: () => goUpCommand.onNext(null),
      setCanGoUp: canGoUp => canGoUpState.onNext(canGoUp),

      goBack: () => goBackCommand.onNext(null),
      setCanGoBack: canGoBack => canGoBackState.onNext(canGoBack),

      open: page => openPageCommand.onNext(page),
    });

    const navigationStackState =
      new Rx.BehaviorSubject(Immutable.List([initialState]));

    const openPageSubscription = openPageCommand
      .withLatestFrom(navigationStackState)
      .map(([page, navigationStack]) =>
        navigationStack.push(page)
      ).subscribe(navigationStackState);

    const goBackSubscription = goBackCommand
      .withLatestFrom(navigationStackState)
      .map(([page, navigationStack]) =>
        navigationStack.pop()
      ).subscribe(navigationStackState);

    const goUpSubscription = goUpCommand
      .map(_ => Immutable.List([initialState]))
      .subscribe(navigationStackState);

    const navigationStackStateSubscription = Rx.Observable.combineLatest(
      navigationStackState,
      canGoUpState,
      canGoBackState,
    ).map(([navigationStack, canGoUp, canGoBack]) => ({
      values: navigationStack.toArray(),
      goUp: RxModels.createCommand(
        () => goUpCommand.onNext(null),
        canGoUp,
      ),
      goBack: RxModels.createCommand(
        () => goBackCommand.onNext(null),
        canGoBack,
      ),
    })).subscribe(observer);

    return () => {
      openPageSubscription.dispose();
      goBackSubscription.dispose();
      goUpSubscription.dispose();
      navigationStackStateSubscription.dispose();
    };
  });
};
