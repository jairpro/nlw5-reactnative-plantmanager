import { isBefore } from 'date-fns'
import * as Notifications from 'expo-notifications'
import { PlantProps } from './storage'

export async function scheduleNotification(plant: any) {
  console.log('plant: ', plant)
  console.log('plant.dateTimeNotification: ', JSON.stringify(plant.dateTimeNotification))

  const nextTime = plant.dateTimeNotification !== {} ? new Date(plant.dateTimeNotification) : new Date()
  console.log('nextTime: ', nextTime)

  const now = new Date()

  const  { times, repeat_every } = plant.frequency
  if (repeat_every === 'week') {
    const interval = Math.trunc(7 / times)
    nextTime.setDate(now.getDate() + interval)
    console.log('nextTime (week): ', nextTime)
  }
  else {
    const dateTime = nextTime
    if (dateTime && isBefore(dateTime, new Date())) {
      nextTime.setDate(nextTime.getDate() + 1)
      console.log('nextTime (+ 1 day): ', nextTime)
    }
  }

  const seconds = Math.abs(
    Math.ceil(now.getTime() - nextTime.getTime()) / 1000
  )
  console.log('seconds: ', seconds)

  const request = {
    content: {
      title: 'Heeey, 🌱',
      body: `Está na hora de cuidar da sua ${plant.name}`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: {
        plant
      },
    },
    trigger: {
      seconds: seconds < 60 ? 60 : seconds,
      repeats: true,
    }
  }

  const notificationId = await Notifications.scheduleNotificationAsync(request)

  return notificationId
}

export async function cancelAllScheduleNotificationsByPlant(id: string) {
  try {
    const allScheduleNotifications = await Notifications.getAllScheduledNotificationsAsync()
    allScheduleNotifications.map(async item => {
      const plant = item.content.data.plant as PlantProps
      if (plant.id == id) {
        try {
          await Notifications.cancelScheduledNotificationAsync(item.identifier)
        }
        catch {}
      }
    })
  }
  catch {}
}

export async function reScheduleNotification(notification: Notifications.Notification) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notification.request.identifier)
    const plant = notification.request.content.data.plant
    await scheduleNotification(plant)
    console.log('aqui final')
    await consoleAllScheduleNotifications()
  }
  catch (error) {
    console.log('reScheduleNotification.error: ', error.message)
  }
}

export async function consoleAllScheduleNotifications() {
  try {
    const allScheduleNotifications = await Notifications.getAllScheduledNotificationsAsync()
    console.log('######## NOTIFICAÇÕES AGENDADAS #######') 
    console.log(allScheduleNotifications)
  }
  catch {}
}