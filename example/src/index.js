/**
 * Copyright (c) 2016, David Bordoley
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.githubusercontent.com/bordoley/ReactiveDataflow/master/LICENSE file.
 *
 * @flow
 */

import * as ApplicationComponent from './common/ApplicationComponent';
import * as UIComponents from './ui-components';

/* eslint-disable no-unused-vars */
import * as React from 'react';
/* eslint-enable no-unused-vars */

import * as ReactDOM from 'react-dom';

const uiComponents = UIComponents.create({});

ReactDOM.render(
  ApplicationComponent.create(uiComponents),
  document.getElementById('container'),
);
