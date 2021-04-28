import AsyncStorage from '@react-native-async-storage/async-storage'
import { format } from 'date-fns'
import { 
  cancelAllScheduleNotificationsByPlant, 
  consoleAllScheduleNotifications, 
  scheduleNotification
} from './notifications'

export const STORAGE_PLANTS = '@plantmanager:plants'

export interface PlantProps {
  id: string
  name: string
  about: string
  water_tips: string
  photo: string
  environments: [string]
  frequency: {
    times: number
    repeat_every: string
  }
  hour: string
  dateTimeNotification: string
}

export interface StoragePlantProps {
  [id: string]: {
    data: PlantProps
    notificationId: string
  }
}

export async function savePlant(plant: PlantProps): Promise<void> {
  try {
    await cancelAllScheduleNotificationsByPlant(plant.id)
    const notificationId = await scheduleNotification(plant)
    await consoleAllScheduleNotifications()

    const data = await AsyncStorage.getItem(STORAGE_PLANTS)
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {}

    const newPlant = {
      [plant.id]: {
        data: plant,
        notificationId,
      }
    }

    delete oldPlants[plant.id]

    const plantsAsString = JSON.stringify({
      ...newPlant,
      ...oldPlants,
    })

    console.log('plantsAsString: ', plantsAsString)
  
    await AsyncStorage.setItem(STORAGE_PLANTS, plantsAsString)
  }
  catch (error) {
    throw new Error(error)
  }
}

export async function loadPlant(): Promise<PlantProps[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_PLANTS)
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {}
    
    const plantsSorted = Object
    .keys(plants)
    .map(plant => {
      return {
        ...plants[plant].data,
        hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
      }
    })
    .sort((a, b) =>
      Math.floor(
        new Date(a.dateTimeNotification).getTime() / 1000 -
        Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
    ))
      
    return plantsSorted
  }
  catch (error) {
    throw new Error(error)
  }
}

export async function removePlant(id: string): Promise<void> {
  const data = await AsyncStorage.getItem(STORAGE_PLANTS)
  let plants = data ? (JSON.parse(data) as StoragePlantProps) : {}

  await cancelAllScheduleNotificationsByPlant(id)
  await consoleAllScheduleNotifications()

  delete plants[id]

  const plantsAsString = JSON.stringify(plants)

  console.log('plantsAsString: ', plantsAsString)

  await AsyncStorage.setItem(STORAGE_PLANTS, plantsAsString)
}