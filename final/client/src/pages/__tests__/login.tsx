import React from 'react';

import {
  renderApollo,
  cleanup,
  fireEvent,
  waitForElement,
} from '../../test-utils';
import Login, {LOGIN_USER} from '../login';
import { cache, isLoggedInVar } from '../../cache';
import { shallow, configure, mount, render  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloConsumer } from '@apollo/client';

configure({ adapter: new Adapter() })

describe('Login Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders login page', async () => {
  //  renderApollo(<Login />);
  let wrapper = mount(<MockedProvider>
    <ApolloConsumer>
        {client => {
            client.stop = jest.fn();
            return <Login/>;
        }}
    </ApolloConsumer>
  </MockedProvider>);
  expect(wrapper.render())
  });

  it('fires login mutation and updates cache after done', async () => {
    expect(isLoggedInVar()).toBeFalsy();

    const mocks = [
      {
        request: {query: LOGIN_USER, variables: {email: 'a@a.a'}},
        result: {
          data: {
            login: {
              id: 'abc123',
              token: 'def456',
            },
          },
        },
      },
    ];

    const {getByText, getByTestId} = await renderApollo(<Login />, {
      mocks,
      cache,
    });
    let wrapper = mount(<MockedProvider>
      <ApolloConsumer>
          {client => {
              client.stop = jest.fn();
              return <Login/>;
          }}
      </ApolloConsumer>
    </MockedProvider>);

    fireEvent.change(getByTestId('login-input'), {
      target: {value: 'a@a.a'},
    });

    fireEvent.click(getByText(/log in/i));

    // login is done if loader is gone
    await waitForElement(() => getByText(/log in/i));
    expect(isLoggedInVar()).toBeTruthy();
  });
});
