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

import * as Immutable from 'immutable';
import * as Rx from 'rx';

export type FacebookFeedStore = {
  state: any;
  loadMore: () => Promise<any>;
  refresh: () => Promise<any>;
  dispose: () => void;
};

type Feed = {
  items: Immutable.List<any>;
  next: string;
}

export const create = (apiKey: string): FacebookFeedStore => {
  const initialCursor =
    `https://graph.facebook.com/v2.5/me/feed?fields=link,message,icon,picture,type&access_token=${apiKey}`;

  const feedState = new Rx.BehaviorSubject({
    items: Immutable.List(),
    next: initialCursor,
  });

  const refreshAction = (feed: Feed) =>
    fetch(
      initialCursor
    ).then(response =>
      response.json()
    ).then(result => {
      const items = Immutable.List(result.data);
      const next = result.paging.next;

      feedState.onNext({
        items: items,
        next: next,
      });
    });

  const loadMoreAction = (feed: Feed) =>
    fetch(
      feed.next
    ).then(response =>
      response.json()
    ).then(result => (
      result.data.length === 0 && result.paging === undefined
        // In practice this behavior is a little annoying since it results
        // in scrolling for more items instead completely reloading your feed
        // when an item has been deleted when what you wanted was to simply get more items.
        // A Better solution would be to determine if the current last item is delete, if
        // not probably refresh, and then keep pulling up to some limit to try to line
        // up with the current state.
        ? refreshAction(feed)
        : (
          feedState.onNext({
            items: feed.items.concat(result.data),
            next: result.paging.next,
          }),
          null
          )
      )
    );

  const incomingRequests = new Rx.Subject();

  // This is a work queue to ensure that only one request is processed at a time.
  const subscription = incomingRequests.map(([action, completer]) =>
    Rx.Observable.defer(() =>
      action(feedState.value).then(_ => completer.onCompleted())
    )
  ).concatAll().subscribe();

  return {
    state: feedState.map(feed => feed.items),

    loadMore: () => {
      const completer = new Rx.Subject();
      incomingRequests.onNext([loadMoreAction, completer]);
      return completer.toPromise();
    },

    refresh: () => {
      const completer = new Rx.Subject();
      incomingRequests.onNext([refreshAction, completer]);
      return completer.toPromise();
    },

    dispose: () => {
      incomingRequests.onCompleted();
      subscription.dispose();
    },
  };
};
