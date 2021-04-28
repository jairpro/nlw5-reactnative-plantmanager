import {
  Jost_400Regular,
  Jost_600SemiBold, useFonts
} from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { reScheduleNotification } from './src/libs/notifications';
import Routes from './src/routes';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  })

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const { title, body } = notification.request.content

        Alert.alert(String(title), String(body), [
          {
            text: 'Depois ⏰',
          },
          {
            text: 'Feito! 😎',
            onPress: async () => {
              await reScheduleNotification(notification)
            },
          },
        ])
    })

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async response => {
        await reScheduleNotification(response.notification)
      }
    )
    return () => subscription.remove()
  }, [])

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <Routes />
  );
}
