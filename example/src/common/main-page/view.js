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

import type { MainPageModel } from './model';
import type { UIComponents } from '../ui-components';

export const create = (
  uiComponents: UIComponents,
): (props: MainPageModel) => React.Element => {
  const { Button, ButtonText, Card, Label } = uiComponents;

  return props => (
    <Card>
      <Label>Pick an Example App</Label>
      <Button command={ props.openGoogleSearch }>
        <ButtonText>Google Search</ButtonText>
      </Button>
      <Button command={ props.openCounter }>
        <ButtonText>Counter</ButtonText>
      </Button>

      <Button command={ props.openNavigator }>
        <ButtonText>Navigator</ButtonText>
      </Button>

      <Button command={ props.openFacebookFeed }>
        <ButtonText>Facebook Feed</ButtonText>
      </Button>
    </Card>
  );
};
