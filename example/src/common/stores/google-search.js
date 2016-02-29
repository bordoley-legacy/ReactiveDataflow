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

import LRU from 'lru';

export type GoogleSearchStore = {
  query: (
      cx: string,
      apiKeyState: string,
      query: string,
    ) => Promise<Array<Object>>;
}

export const create = (
  cacheSize: number,
): GoogleSearchStore => {
  const cache = new LRU(cacheSize);

  return {
    query: (cx: string, apiKey: string, query: string) => {
      const key = cx + apiKey + query;

      const result = cache.get(key);
      return result
        ? Promise.resolve(result)
        : fetch(`https://www.googleapis.com/customsearch/v1?cx=${ cx }&key=${ apiKey }&q=${ query }`)
            .then(response => response.json())
            .then(result => {
              const retval = (result.items || []).map(x => x.link);
              cache.set(key, retval);
              return retval;
            });
    },
  };
};
