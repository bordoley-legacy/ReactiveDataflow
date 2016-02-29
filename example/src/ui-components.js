/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

import * as React from 'react';

import type { UIComponents } from './common/ui-components';
import type { Property } from 'reactive-dataflow-models';

const onChangeCb = (property: Property) =>
  ev => property.update(ev.target.value);

export const create = (styles: any): UIComponents => ({
  ActivityIndicator: props => <div>Loading...</div>,
  Button: props => (
      <button
          disabled={ !props.command.canExecute }
          onClick={ props.command.execute }
      >
        { props.children }
      </button>
    ),
  ButtonText: props => <span>{ props.children }</span>,
  Card: props => <div>{ props.children }</div>,
  Container: props => <div>{ props.children }</div>,
  Label: props => <div>{ props.children }</div>,
  ListView: props => (
      <div>
        { props.rows.map((row, i) =>
          <div key={ i }>{ props.renderRow(row) }</div>)
        }
        <button onClick={ props.onEndReached }>
          { "Load More" }
        </button>
      </div>
    ),
  Navigator: props => {
    const length = props.navigationStack.length;
    const last = props.navigationStack[length - 1];

    return (
      <div>
        <button disabled={ !props.goBack.canExecute } onClick={ props.goBack.execute }>
          Go Back
        </button>
        { props.renderScene(last) }
      </div>
    );
  },
  TextBox: props => (
      <input
        disabled={ !props.property.canUpdate }
        onChange={ onChangeCb(props.property) }
        type="text"
        value={ props.property.value }
      />
    ),
  Thumbnail: props => <img src={ props.href } />,
});
