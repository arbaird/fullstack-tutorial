import React from 'react';

import {
  renderApollo,
  cleanup,
  waitForElement,
} from '../../test-utils';
import Cart from '../cart';
import { GET_LAUNCH } from '../../containers/cart-item';
import { cache, cartItemsVar } from '../../cache';
import { shallow, configure, mount, render  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloConsumer } from '@apollo/client';

configure({ adapter: new Adapter() })
const originalError = console.error;

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    id: 1,
    name: 'tester',
  },
  mission: {
    name: 'test mission',
    missionPatch: '/',
  },
};

describe('Cart Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders with message for empty carts', () => {
    //const { getByTestId } = renderApollo(<Cart />, { cache });
    //return waitForElement(() => getByTestId('empty-message'));
    let wrapper = mount(<MockedProvider>
      <ApolloConsumer>
          {client => {
              client.stop = jest.fn();
              return <Cart />;
            }}
            </ApolloConsumer>
          </MockedProvider>)
      setTimeout( ()=>{
        wrapper.update();
        expect(wrapper.render().text().toLowerCase().includes('empty-message')).toBe(true);
      },1000)
  });

  it('renders cart', () => {
    let mocks = [
      {
        request: { query: GET_LAUNCH, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];

    //const { getByTestId } = renderApollo(<Cart />, { cache, mocks });
    //cartItemsVar(['1']);
    //return waitForElement(() => getByTestId('book-button'));

    let wrapper = mount(<MockedProvider mocks={mocks}>
      <ApolloConsumer>
          {client => {
              client.stop = jest.fn();
              return <Cart />;
            }}
            </ApolloConsumer>
          </MockedProvider>);
  });



});
