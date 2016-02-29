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

import type { CounterModel } from './model';
import type { UIComponents } from '../ui-components';

export const create = (
  uiComponents: UIComponents,
): (props: CounterModel) => React.Element => {
  const { Button, ButtonText, Card, Label } = uiComponents;

  return props => (
    <Card>
      <Label>Count: { props.count }</Label>
      <Button command={ props.incrementCountBy1 }>
        <ButtonText>Increment By 1</ButtonText>
      </Button>
      <Button command={ props.incrementCountBy4 }>
        <ButtonText>Increment By 4</ButtonText>
      </Button>
    </Card>
  );
};
