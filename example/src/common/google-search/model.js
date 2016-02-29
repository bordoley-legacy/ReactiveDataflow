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

import type { Property } from 'reactive-dataflow-models';
import type { GoogleSearchStore } from '../stores/google-search';

export type GoogleSearchModel = {
  cx: Property<string>;
  apiKey: Property<string>;
  query: Property<string>;
  isLoading: bool;
  searchResults: Array<string>;
};

export const create = (
  store: GoogleSearchStore,
) => Rx.Observable.create(observer => {
  const cxState = new Rx.BehaviorSubject("017371930614414984696:ci0dgyvwpq8");
  const apiKeyState = new Rx.BehaviorSubject("");
  const queryState = new Rx.BehaviorSubject("");
  const searchResultsState = new Rx.BehaviorSubject([]);
  const isLoadingState = new Rx.BehaviorSubject(false);

  const searchResultsStateSubscription =
    Rx.Observable.combineLatest(
      cxState,
      apiKeyState,
      queryState
    ).filter(([cx, apiKey, query]) =>
      cx.length > 0 && apiKey.length > 0 && query.length > 0
    ).do(x => {
      isLoadingState.onNext(true);
    }).debounce(
      500 /* ms */
    ).flatMap(([cx, apiKey, searchText]) =>
      store.query(cx, apiKey, searchText)
    ).do(x =>
      isLoadingState.onNext(false)
    ).subscribe(searchResultsState);

  const observerSubscription =
    Rx.Observable.combineLatest(
      cxState,
      apiKeyState,
      queryState,
      searchResultsState,
      isLoadingState
    ).map(([cx, apiKey, query, searchResults, isLoading]) => ({
      cx: RxModels.createProperty(
        cx,
        cx => cxState.onNext(cx),
      ),

      apiKey: RxModels.createProperty(
        apiKey,
        apiKey => apiKeyState.onNext(apiKey),
      ),

      query: RxModels.createProperty(
        query,
        query => queryState.onNext(query),
        cx.length > 0 && apiKey.length > 0,
      ),

      searchResults: searchResults,

      isLoading: isLoading,
    })).subscribe(observer);

  return () => {
    searchResultsStateSubscription.dispose();
    observerSubscription.dispose();
  };
});
