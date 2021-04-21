import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Constants from 'expo-constants'

import watering from '../assets/watering.png'
import colors from '../styles/colors'
import { Button } from '../components/Button'

const statusBarHeight = Constants.statusBarHeight

export function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Gerencie {'\n'}
        suas plantas de {'\n'}
        forma fácil
      </Text>

      <Image source={watering} style={styles.image}/>

      <Text style={styles.subtitle}>
        Não esqueça mais de regar suas plantas.
        Nós cuidamos de lembrar você sempre que precisar.
      </Text>

      <Button title={`>`} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between' 
  },

  title: {
    marginTop: statusBarHeight + 38,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.heading,
  },

  image: {
    width: 292,
    height: 284, 
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    color: colors.heading,
  },
})