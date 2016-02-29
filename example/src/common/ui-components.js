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

import type { Command, Property } from 'reactive-dataflow-models';

export type UIComponents = {
  ActivityIndicator: (
      props: {
      },
    ) => React.Element;
  Button: (
      props: {
        command: Command;
        children: any;
      },
    ) => React.Element;
  ButtonText: (
      props: {
        children: any,
      },
    ) => React.Element;
  Card: (
      props: {
        children: any;
      },
    ) => React.Element;
  Container: (
      props: {
        children: any;
      },
    ) => React.Element;
  Label: (
      props: {
        children: any;
      },
    ) => React.Element;
  ListView: (
      props: {
        onEndReached: () => void;
        renderRow: (props: any) => React.Element;
        rows: Array<any>;
      },
    ) => React.Element;
  Navigator: (
      props: {
        goBack: () => void;
        goUp: () => void;
        navigationStack: Array<any>;
        renderScene: (props: any) => React.Element;
      },
    ) => React.Element;
  TextBox: (
      props: {
        property: Property<string>;
      },
    ) => React.Element;
  Thumbnail: (
      props: {
        href: string;
      },
    ) => React.Element;
};
