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

import type { UIComponents } from '../ui-components';
import type { GoogleSearchModel } from './model';

export const create = (
  uiComponents: UIComponents,
): (props: GoogleSearchModel) => React.Element => {
  const { Card, Label, TextBox, ListView } = uiComponents;

  const rowHasChanged = (r1, r2) => r1 !== r2;
  const renderRow = (rowData) =>
    <Label>{ rowData }</Label>;

  return props => (
    <Card>
      <Card>
        <Label>CX:</Label>
        <TextBox property={ props.cx }/>
      </Card>

      <Card>
        <Label>API Key:</Label>
        <TextBox property={ props.apiKey } />
      </Card>

      <Card>
        <Label>Search For:</Label>
        <TextBox property={ props.query } />
      </Card>

      <ListView
        renderRow={ renderRow }
        rowHasChanged={ rowHasChanged }
        rows={ props.searchResults }
      />
    </Card>
  );
};
