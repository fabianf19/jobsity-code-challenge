import fetch from 'cross-fetch'
import config from '../config'

export const request = (method, url, params, callbackSuccess, callbackError) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  const proxy = 'https://cors-anywhere.herokuapp.com/'

  fetch(`${proxy}${config.WEATHER_API}${url}`, {
    mode: 'no-cors',
    headers: headers,
    method: method,
    body: (method !== 'GET') ? JSON.stringify(params) : null
  })
    .then(response => {
      if (response.status >= 500) {
        callbackError({
          status: response.status,
          message: 'Internal server error'
        })
        return
      }
      return response.json()
    })
    .then(json => {
      callbackSuccess(json)
    })
    .catch(error => {
      callbackError(error)
    })
}
