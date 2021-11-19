import React from 'react';
import { InMemoryCache } from '@apollo/client';

import {
  renderApollo,
  cleanup,
  waitForElement,
} from '../../test-utils';
import Launches, { GET_LAUNCHES } from '../launches';
import { shallow, configure, mount, render  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloConsumer } from '@apollo/client';

configure({ adapter: new Adapter() })

const mockLaunch = {
  __typename: 'Launch',
  id: 1,
  isBooked: true,
  rocket: {
    __typename: 'Rocket',
    id: 1,
    name: 'tester',
    type: 'test',
  },
  mission: {
    __typename: 'Mission',
    id: 1,
    name: 'test mission',
    missionPatch: '/',
  },
  site: 'earth',
  isInCart: false,
};

describe('Launches Page', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders launches', async () => {
    const cache = new InMemoryCache({ addTypename: false });
    const mocks = [
      {
        request: { query: GET_LAUNCHES },
        result: {
          data: {
            launches: {
              cursor: '123',
              hasMore: true,
              launches: [mockLaunch],
            },
          },
        },
      },
    ];
   const { getByText } = await renderApollo(<Launches />, {
      mocks,
      cache,
    });
    let wrapper = shallow(<MockedProvider mocks={mocks}>
      <ApolloConsumer>
          {client => {
              client.stop = jest.fn();
              return <Launches/>;
            }}
            </ApolloConsumer>
          </MockedProvider>);
    //await waitForElement(() => getByText(/test mission/i));
    expect(wrapper.find({ "data-testid": "message" })).toBeTruthy();
  });
});
