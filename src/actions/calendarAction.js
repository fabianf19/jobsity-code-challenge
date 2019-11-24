import { request } from '../utils/request'
import moment from 'moment'

export const RECEIVE_FORECAST_FOR_REMINDER = 'RECEIVE_FORECAST_FOR_REMINDER'
export const receiveWeatherForecast = (reminderId, data) => dispatch => {
  dispatch({
    type: RECEIVE_FORECAST_FOR_REMINDER,
    reminderId,
    data
  })
}

export const FORECAST_ERROR = 'FORECAST_ERROR'
export const forecastError = (error) => dispatch => {
  dispatch({
    type: FORECAST_ERROR,
    error
  })
}

export const getWeatherForecastForReminder = (reminderId, date, city) => dispatch => {
  request('GET', `/${city.lat},${city.lng},${moment(date).unix()}`, null,
    (data) => {
      return dispatch(receiveWeatherForecast(reminderId, data))
    },
    (error) => {
      console.log(error)
      return dispatch(forecastError({ error: 'Unable to get chats' }))
    }
  )
}

// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************

export const SAVE_REMINDER = 'SAVE_REMINDER'
export const saveReminder = (reminderId, content, date, color, city) => dispatch => {
  dispatch({
    type: SAVE_REMINDER,
    reminderId,
    content,
    date,
    color,
    city
  })

  dispatch(getWeatherForecastForReminder(reminderId, date, city))
}

export const DELETE_ALL_REMINDERS_FOR_DATE = 'DELETE_ALL_REMINDERS_FOR_DATE'
export const deleteRemindersForDate = (date) => dispatch => {
  dispatch({
    type: DELETE_ALL_REMINDERS_FOR_DATE,
    date
  })
}
