import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  {
    user {
      _id
      firstName
      lastName
      dob
      username
      homes {
        _id
        address {
          _id
          street1
          street2
          city
          state
          zip
        }
        areas {
          _id
          name
          icon
          attributes {
            _id
            type
            detail {
              _id
              key
              value
			  date
            }
          }
        }
      }
    }
  }
`;

export const QUERY_GET_HOME = gql`
query getHome($homeId: ID!) {
  home(homeId: $homeId) {
    _id
    address {
      street1
      street2
      city
      state
      zip
    }
    areas {
		_id
		name
		icon
		attributes {
		  _id
		  type
		  detail {
			_id
			key
			value
			date
		  }
		}
	}
  }
}
`

export const QUERY_TRANSFERS = gql`
query Transfers {
	transfers {
		_id
		transferer
		receiver
		home {
			address {
				street1
				street2
				city
				state
				zip
			}
		}
	}
}
`;

  
export const QUERY_SINGLE_TRANSFER = gql`
query Transfer($transferId: ID!) {
	transfer(transferId: $transferId) {
		_id
		transferer
		receiver
		home {
			address {
				street1
				street2
				city
				state
				zip
			}
		}
	}
}
`;
// Use graph and apollo to update user email
export const QUERY_UPDATE_USER = gql`
  {
    user {
      firstName
      lastName
      dob
      username
            }
          }
 `;
