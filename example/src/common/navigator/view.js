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

import type { NavigatorModel } from './model';
import type { UIComponents } from '../ui-components';

export const create = (
  uiComponents: UIComponents,
): (props: NavigatorModel) => React.Element => {
  const { Button, ButtonText, Card, Label } = uiComponents;

  return (props: NavigatorModel) => (
    <Card>
      <Label>Page {props.page} ------------------------------------</Label>
      <Button command={ props.open }>
        <ButtonText>Open Page</ButtonText>
      </Button>

      <Button command={ props.goBack }>
        <ButtonText>Go Back</ButtonText>
      </Button>

      <Button command={ props.goUp }>
        <ButtonText>Go Up</ButtonText>
      </Button>
    </Card>
  );
};
