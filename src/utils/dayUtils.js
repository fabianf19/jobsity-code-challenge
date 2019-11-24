import moment from 'moment'

export const searchRemindersByDate = (reminders, date) => {
  return reminders.filter((reminder) => {
    const reminderMomentDate = moment(reminder.date)
    return date.format('DD-MM-YYYY') === reminderMomentDate.format('DD-MM-YYYY')
  }).sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf())
}
