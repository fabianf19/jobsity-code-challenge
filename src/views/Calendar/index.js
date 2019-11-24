import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import './Calendar.scss'

import moment from 'moment'
import DateTimePicker from 'react-datetime-picker'
import { SketchPicker } from 'react-color'

import Panel from '../../components/Panel'

import { saveReminder, deleteRemindersForDate } from '../../actions/calendarAction'
import { searchRemindersByDate } from '../../utils/dayUtils'

const cities = require('../../files/cities.json')

const dayIndexDays = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
}

class Calendar extends Component {
  constructor (props) {
    super(props)

    const nowDate = moment()

    this.state = {
      currentMonthYear: {
        month: nowDate.month() + 1,
        year: nowDate.year()
      },
      currentOpenDay: null,
      reminder: {
        id: -1,
        content: '',
        date: new Date(),
        color: '#fff',
        city: {
          country: 'CO',
          name: 'Zipaquirá',
          lat: '5.02208',
          lng: '-74.00481'
        }
      }
    }

    this.renderCalendar()
  }

  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--
  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--
  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--
  // RENDER METHODS

  renderCalendar = () => {
    const { currentMonthYear } = this.state
    const currentDate = moment(`01-${currentMonthYear.month}-${currentMonthYear.year}`, 'DD-MM-YYYY')
    let currentMonthDate = currentDate.startOf('month')
    const startDayString = currentMonthDate.format('dddd')
    const startDayIndex = dayIndexDays[startDayString]

    let previousMonth = currentDate.subtract(1, 'months').endOf('month').subtract(startDayIndex - 1, 'days')

    const rows = []
    let row = []

    for (let i = 0; i < 36; i++) {
      if (i < startDayIndex) {
        row.push(this.renderDay(previousMonth))
        previousMonth = previousMonth.add(1, 'days')
      } else {
        row.push(this.renderDay(currentMonthDate))
        currentMonthDate = currentMonthDate.add(1, 'days')
      }

      if (row.length === 7) {
        rows.push(row)
        row = []
      }
    }

    return rows.map((row, index) => {
      return (
        <tr key={`${index}-row`}>
          {row.map(day => day)}
        </tr>
      )
    })
  }

  renderDay = (date) => {
    const deleteDate = moment(date)
    const { currentMonthYear } = this.state
    const currentDate = moment(`01-${currentMonthYear.month}-${currentMonthYear.year}`, 'DD-MM-YYYY')

    const isGrayed = (date.month() !== currentDate.month()) ? 'day__is-grayed' : ''
    const isToday = (date.format('MM') === moment().format('MM') && date.format('D') === moment().format('D')) ? 'day__is-today' : ''

    const remindersForDay = searchRemindersByDate(this.props.reminders, date)

    const clearRemindersButton = (remindersForDay.length > 0) ? (
      <button className='button is-info button-trash' onClick={() => this.clearRemindersForDate(deleteDate)}>
        <span className='icon'>
          <i className='fa fa-trash' />
        </span>
      </button>
    ) : null

    return (
      <td key={date.format('DD-MM-YYYY')} className={`day ${isGrayed} ${isToday}`}>
        <div className='day__header'>
          <div>{date.format('D')}</div>
          {clearRemindersButton}
        </div>
        <div className='day__reminders'>
          {this.renderReminders(remindersForDay)}
        </div>
      </td>
    )
  }

  renderReminders = (reminders) => {
    if (reminders.length === 0) {
      return null
    }

    return reminders.map(reminder => {
      let weatherIcon = null

      if ('weather' in reminder) {
        const faMapper = {
          'clear-day': 'sun-o',
          'clear-night': 'moon',
          rain: 'tint',
          snow: 'snowflake',
          sleet: 'cookie',
          wind: 'wind',
          fog: 'umbrella',
          cloudy: 'cloud',
          'partly-cloudy-day': 'cloud',
          'partly-cloudy-night': 'moon-o',
          hail: 'icicles',
          thunderstorm: 'bolt',
          tornado: 'torah'
        }

        weatherIcon = (
          <span className='icon'>
            <i className={`fa fa-${faMapper[reminder.weather]}`} />
          </span>
        )
      }

      return (
        <div key={reminder.id} className='reminder' onClick={() => this.editReminder(reminder)}>
          <div className='reminder__header'>
            <div className='reminder-ball' style={{ backgroundColor: reminder.color.hex }} />
            <div className='reminder-content'>
              <span className='time'>{moment(reminder.date).format('hh:mm a')}</span>
            </div>
            {weatherIcon}
          </div>
          <p>{reminder.content}</p>
        </div>
      )
    }
    )
  }

  renderAllCities = () => {
    return (
      <div className='select'>
        <select onChange={(e) => this.citySelected(e.target.value)} value={this.state.reminder.city.name}>
          {cities.map((city, index) =>
            <option key={`${city.name}-${index}`} value={city.name}>{city.name}</option>
          )}
        </select>
      </div>
    )
  }

  renderCalendarActions = () => {
    const { currentMonthYear } = this.state
    const currentDate = moment(`01-${currentMonthYear.month}-${currentMonthYear.year}`, 'DD-MM-YYYY')

    return (
      <div className='calendar-actions'>
        <h2>Current Month: {currentDate.format('MMMM YYYY')}</h2>

        <button className='button is-info' onClick={() => this.createNewReminder()}>
          <span>Reminder</span>
          <span className='icon'>
            <i className='fa fa-plus' />
          </span>
        </button>
        <button className='button button__left is-primary' onClick={() => this.changeMonth(-1)}>
          <span className='icon'>
            <i className='fa fa-arrow-left' />
          </span>
          <span>Previous</span>
        </button>
        <button className='button button__right is-primary' onClick={() => this.changeMonth(1)}>
          <span>Next</span>
          <span className='icon'>
            <i className='fa fa-arrow-right' />
          </span>
        </button>
      </div>
    )
  }

  renderPanel = () => {
    return (
      <Panel title='Reminder Panel' ref={reminderPanel => this.reminderPanel = reminderPanel} greenButtonAction={this.saveReminder}>
        <div className='panel-body reminder-panel'>
          <p className='subtitle'>Reminder Content</p>
          <textarea className='textarea' placeholder='e.g. Hello world' value={this.state.reminder.content} onChange={e => this.editReminderContent(e)} />

          <p className='subtitle'>Reminder Date and Time</p>
          <DateTimePicker
            onChange={this.changeReminderDate}
            value={this.state.reminder.date}
          />

          <p className='subtitle'>City</p>
          {this.renderAllCities()}

          <p className='subtitle'>Color</p>
          <SketchPicker
            color={this.state.reminder.color}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
      </Panel>
    )
  }

  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--
  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--
  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--

  clearRemindersForDate = (date) => {
    this.props.deleteRemindersForDate(date)
  }

  editReminder = (reminder) => {
    const reminderCopy = _.cloneDeep(reminder)
    reminderCopy.date = new Date(reminderCopy.date)
    this.setState({ reminder: reminderCopy })
    this.reminderPanel.toggle(true)
  }

  citySelected = (cityName) => {
    const city = cities.find(e => e.name === cityName)

    const { reminder } = this.state
    reminder.city = city

    this.setState({ reminder })
  }

  changeMonth = (monthNumber) => {
    const { currentMonthYear } = this.state
    const nextMonthNumber = currentMonthYear.month + monthNumber

    if (nextMonthNumber === 0) {
      currentMonthYear.month = 12
      currentMonthYear.year -= 1
      this.setState({ currentMonthYear })
    } else if (nextMonthNumber > 12) {
      currentMonthYear.month = 1
      currentMonthYear.year += 1
      this.setState({ currentMonthYear })
    } else {
      currentMonthYear.month = nextMonthNumber
      this.setState({ currentMonthYear })
    }
  }

  createNewReminder = () => {
    const reminder = {
      id: -1,
      content: '',
      date: new Date(),
      color: '#fff',
      city: {
        country: 'CO',
        name: 'Zipaquirá',
        lat: '5.02208',
        lng: '-74.00481'
      }
    }
    this.setState({ reminder })
    this.reminderPanel.toggle(true)
  }

  editReminderContent = (e) => {
    const { reminder } = this.state

    if (e.target.value.length < 31) {
      reminder.content = e.target.value
    }

    this.setState({ reminder })
  }

  changeReminderDate = (date) => {
    const { reminder } = this.state
    reminder.date = date

    this.setState({ reminder })
  }

  handleChangeComplete = (color) => {
    const { reminder } = this.state
    reminder.color = color

    this.setState({ reminder })
  }

  saveReminder = () => {
    const { reminder } = this.state
    const reminderId = reminder.id
    const { content, date, color, city } = reminder

    this.props.saveReminder(reminderId, content, date, color, city)
    this.forceUpdate()
    this.reminderPanel.toggle(false)

    setTimeout(() => {
      this.forceUpdate()
    }, 2000)
  }

  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--
  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--
  // --=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=----=--
  // MAIN RENDER

  render () {
    return (
      <div className='calendar-root'>
        {this.renderPanel()}

        <section className='hero is-info'>
          <div className='hero-body'>
            <div className='container'>
              <h1 className='title'>
              Jobsity Code Challenge - Calendar
              </h1>
              <h2 className='subtitle'>
              By: Fabian Fuenmayor
              </h2>
            </div>
          </div>
        </section>

        <section className='calendar'>
          <div className='container'>
            {this.renderCalendarActions()}

            <table className='table is-bordered is-striped is-fullwidth'>
              <thead>
                <tr>
                  <th>Sunday</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                  <th>Friday</th>
                  <th>Saturday</th>
                </tr>
              </thead>
              <tbody>
                {this.renderCalendar()}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.mainReducer.isFetching,
  reminders: state.mainReducer.reminders
})

const mapDispatchToProps = dispatch => ({
  saveReminder: (reminderId, content, date, color, city) => dispatch(saveReminder(reminderId, content, date, color, city)),
  deleteRemindersForDate: (date) => dispatch(deleteRemindersForDate(date))
})

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
