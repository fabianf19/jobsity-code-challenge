/*
 src/reducers/mainReducer.js
 */

import uuidv1 from 'uuid/v1'
import moment from 'moment'

const initialState = {
  isFetching: false,
  reminders: []
}

function saveReminder (state, action) {
  const { reminderId, content, date, color, city } = action

  const reminders = state.reminders

  if (reminderId === -1) {
    const nReminder = {
      id: reminderId,
      content,
      date,
      color,
      city
    }

    reminders.push(nReminder)
  } else {
    const currentReminderIndex = reminders.findIndex(reminder => reminder.id === reminderId)
    reminders[currentReminderIndex] = {
      id: reminderId,
      content,
      date,
      color,
      city
    }
  }

  return Object.assign({}, state, {
    reminders
  })
}

function setWeatherForReminder (state, action) {
  const { reminderId, data } = action

  const reminders = state.reminders
  const currentReminderIndex = reminders.findIndex(reminder => reminder.id === reminderId)
  reminders[currentReminderIndex].id = uuidv1()
  reminders[currentReminderIndex].weather = data.currently.icon

  return Object.assign({}, state, {
    reminders
  })
}

function deleteRemindersDate (state, action) {
  const { date } = action
  const reminders = state.reminders

  const filteredReminders = reminders.filter((reminder) => {
    const reminderMomentDate = moment(reminder.date)
    return date.format('DD-MM-YYYY') !== reminderMomentDate.format('DD-MM-YYYY')
  })

  return Object.assign({}, state, {
    reminders: filteredReminders
  })
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_REMINDER':
      return saveReminder(state, action)
    case 'DELETE_ALL_REMINDERS_FOR_DATE':
      return deleteRemindersDate(state, action)
    case 'RECEIVE_FORECAST_FOR_REMINDER':
      return setWeatherForReminder(state, action)

    default:
      return state
  }
}
