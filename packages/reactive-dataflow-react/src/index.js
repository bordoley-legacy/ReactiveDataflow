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
import shallowEqual from 'shallowEqual';

// These are the same type definitions used by RxES7
export type Disposable = {
  dispose: () => void;
};

export type Observer<T> = {
  onCompleted: () => void;
  onError: (error: mixed) => void;
  onNext: (value: T) => void;
};

export type Observable<T> = {
  subscribe: (observer: Observer<T>) => Disposable;
};

type DataflowComponentProps<Props> = {
  source: Observable<Props>;
  render: (props: Props) => ?React.Element;
};

type DataflowComponentState<Props> = {
  props: ?Props;
};

class ReactiveDataflowComponentImpl<Props> extends React.Component<
  void,
  DataflowComponentProps<Props>,
  DataflowComponentState<Props>
> {

  state: DataflowComponentState<Props>;
  subscription: ?Disposable;

  constructor(props: DataflowComponentProps<Props>) {
    super(props);

    this.state = { props: null };
    this.subscription = null;
  }

  _subscribe(props: DataflowComponentProps<Props>): void {
    const onNext = (props: Props) => this.setState({ props: props });
    const onCompleted = () => {};
    const onError = () => {};

    this.subscription = props.source.subscribe({
      onNext,
      onError,
      onCompleted,
    });
  }

  _disposeSubscription(): void {
    const subscription = this.subscription;
    if (subscription != null) { subscription.dispose(); }
  }

  componentWillMount(): void {
    this._subscribe(this.props);
  }

  componentWillReceiveProps(next: DataflowComponentProps<Props>): void {
    this._disposeSubscription();
    this._subscribe(next);
  }

  componentWillUnmount(): void {
    this._disposeSubscription();
  }

  shouldComponentUpdate(
    nextProps: DataflowComponentProps<Props>,
    nextState: DataflowComponentState<Props>,
  ): boolean {
    return !shallowEqual(this.state.props, nextState.props);
  }

  render(): ?React.Element {
    const props = this.state.props;
    const render = this.props.render;

    return props != null ? render(props) : null;
  }
}

// FIXME: export this directly when flow 0.23 ships
const ReactiveDataflowComponent = function<Props>(props: {
  render: (props: Props) => ?React.Element;
  source: Observable<Props>;
}): React.Element {
  return React.createElement(ReactiveDataflowComponentImpl, props);
};

export default ReactiveDataflowComponent;
