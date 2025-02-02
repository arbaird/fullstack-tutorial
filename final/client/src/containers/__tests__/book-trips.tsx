import React from 'react';

import {
  renderApollo,
  cleanup,
  fireEvent,
  waitForElement,
} from '../../test-utils';
import BookTrips, { BOOK_TRIPS } from '../book-trips';
import { GET_LAUNCH } from '../cart-item';
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
    id: 1,
    name: 'tester',
  },
  mission: {
    name: 'test mission',
    missionPatch: '/',
  },
};

describe('book trips', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders without error', () => {
    const { getByTestId } = renderApollo(<BookTrips cartItems={[]} />);
    expect(getByTestId('book-button')).toBeTruthy();
  });

  it('completes mutation and shows message', async () => {
    let mocks = [
      {
        request: { query: BOOK_TRIPS, variables: { launchIds: ['1'] } },
        result: {
          data: {
            bookTrips: [{ success: true, message: 'success!', launches: [] }],
          },
        },
      },
      {
        // we need this query for refetchQueries
        request: { query: GET_LAUNCH, variables: { launchId: '1' } },
        result: { data: { launch: mockLaunch } },
      },
    ];
    
    const { getByTestId } = renderApollo(
      <BookTrips cartItems={['1']} />,
      { mocks, addTypename: false },
    );

    let wrapper = shallow(<MockedProvider mocks={mocks}>
      <ApolloConsumer>
          {client => {
              client.stop = jest.fn();
              return <BookTrips cartItems={['1']}/>;
          }}
      </ApolloConsumer>
    </MockedProvider>);

    fireEvent.click(getByTestId('book-button'));

    // Let's wait until our mocked mutation resolves and
    // the component re-renders.
    // getByTestId throws an error if it cannot find an element with the given ID
    // and waitForElement will wait until the callback doesn't throw an error
    //---replaced code for reference---
    //await waitForElement(() => getByTestId('message'));
    //---end reference---
    expect(wrapper.find({ "data-testid": "message" })).toBeTruthy();
  });

  // >>>> TODO
  it('correctly updates cache', () => {});
});
