import mainReducer from './mainReducer'
import * as types from '../actions/calendarAction'

describe('todos reducer', () => {
  it ('should return the initial state', () => {
    expect (mainReducer(undefined, {})).toEqual(
      {
        isFetching: false,
        reminders: []
      }
    )
  })

  it('should handle SAVE_REMINDER for new reminder', () => {
    expect(
      mainReducer(undefined, {
        type: types.SAVE_REMINDER,
        reminderId: -1,
        content: 'New reminder',
        date: new Date(2019, 11),
        color: '#fff',
        city: {
          country: 'CO',
          name: 'Zipaquirá',
          lat: '5.02208',
          lng: '-74.00481'
        }
      })
    ).toEqual({
      isFetching: false,
      reminders: [{
        city: {
          country: 'CO',
          lat: '5.02208',
          lng: '-74.00481',
          name: 'Zipaquirá'
        },
        color: '#fff',
        content: 'New reminder',
        date: new Date(2019, 11),
        id: -1
      }]
    }
    )
  })

  it('should handle SAVE_REMINDER for existing reminder', () => {
    expect(
      mainReducer({
        isFetching: false,
        reminders: [{
          city: {
            country: 'CO',
            lat: '5.02208',
            lng: '-74.00481',
            name: 'Zipaquirá'
          },
          color: '#fff',
          content: 'New reminder',
          date: new Date(2019, 11),
          id: 1234567890
        }]
      }, {
        type: types.SAVE_REMINDER,
        reminderId: 1234567890,
        content: 'Edit reminder',
        date: new Date(2019, 11),
        color: '#aaa',
        city: {
          country: 'CO',
          name: 'Zipaquirá',
          lat: '5.02208',
          lng: '-74.00481'
        }
      })
    ).toEqual({
      isFetching: false,
      reminders: [{
        city: {
          country: 'CO',
          lat: '5.02208',
          lng: '-74.00481',
          name: 'Zipaquirá'
        },
        color: '#aaa',
        content: 'Edit reminder',
        date: new Date(2019, 11),
        id: 1234567890
      }]
    }
    )
  })
})
