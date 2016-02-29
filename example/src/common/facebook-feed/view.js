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

import type { FacebookFeedModel, FeedPage, LoggedOutPage } from './model';
import type { UIComponents } from '../ui-components';

export const create = (
  uiComponents: UIComponents,
): (props: FacebookFeedModel) => React.Element => {
  const {
    ActivityIndicator,
    Button,
    ButtonText,
    Card,
    Container,
    Label,
    TextBox,
    ListView,
    Thumbnail,
  } = uiComponents;

  const LinkFeedItemView = (props: any) =>
    <Label>Link</Label>;

  const PhotoFeedItemView = (props: any) =>
    <Thumbnail href={props.picture} />;

  const StatusFeedItemView = (props: any) =>
    <Label>{props.message}</Label>;

  const VideoFeedItemView = (props: any) =>
    <Label>Video</Label>;

  const FeedItemView = (props: any) => {
    const type = props.type;
    return (
        type === 'link'    ? <LinkFeedItemView { ...props }/>
      : type === 'photo'   ? <PhotoFeedItemView { ...props }/>
      : type === 'status'  ? <StatusFeedItemView { ...props }/>
      : type === 'video'   ? <VideoFeedItemView { ...props }/>
      : type === 'loading' ? <Card><ActivityIndicator/></Card>
      :                      <Card><Label>{type}</Label></Card>
    );
  };

  const rowHasChanged = (r1, r2) => r1 !== r2;

  const FeedPageView = (props: FeedPage) => (
    <Container>
      <Button command={ props.logOut }>
        <ButtonText>Log Out</ButtonText>
      </Button>
      <ListView
        onEndReached={ props.loadMore.execute }
        renderRow={ FeedItemView }
        rowHasChanged={ rowHasChanged }
        rows={ props.feed.push({type: 'loading'}).toArray() }
      />
    </Container>
  );

  const LoadingPageView = (props: {}) => (
    <Card>
      <ActivityIndicator/>
    </Card>
  );

  const LoggingInView = (props: {}) => (
    <Card>
      <ActivityIndicator/>
    </Card>
  );

  const LogInFormView = (props: LoggedOutPage) => (
    <Card>
      { props.loginFailed ? <Label>Login Failed!!!</Label> : null }

      <Label>Enter your facebook api key:</Label>

      <TextBox property={ props.apiKey }/>

      <Button command={ props.doLogin }>
        <ButtonText>Log In</ButtonText>
      </Button>
    </Card>
  );

  const LoggedOutPageView = (props: LoggedOutPage) => props.loggingIn
    ? <LoggingInView/>
    : <LogInFormView { ...props } />;

  return (props: FacebookFeedModel) => (
      props.tag === 'loading'   ? <LoadingPageView/>
    : props.tag === 'loggedIn'  ? <FeedPageView { ...props.props }/>
    : props.tag === 'loggedOut' ? <LoggedOutPageView { ...props.props }/>
    :                             <Card/>
  );
};
