import React, { useEffect, useState } from 'react'
import { 
  Image, 
  StyleSheet, 
  Text, 
  View,
  Platform,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';

import { getStatusBarHeight } from 'react-native-iphone-x-helper'

import userImg from '../assets/profile.example.png'
import colors from '../styles/colors'
import fonts from '../styles/fonts'
import { TouchableOpacity } from 'react-native-gesture-handler'

export function Header() {
  const [userName, setUserName] = useState<string>()
  const [userImage, setUserImage] = useState('')
  const [isLoadingImage, setIsLoagingImage] = useState(true)

  const navigation = useNavigation()

  const isFocused = useIsFocused()

  function handleName() {
    navigation.navigate('UserIdentification')
  }

  const STORAGE_USER_IMAGE = '@plantmanager:userImage'

  async function imageSubmit(uri: string) {
    try {
      await AsyncStorage.setItem(STORAGE_USER_IMAGE, uri)
      setUserImage(uri)
    }
    catch {
      Alert.alert('Não foi possível salvar o sua imagem. 😢')
    }
  }

  const handleImageSelect = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    //console.log(result)

    if (!result.cancelled) {
      await imageSubmit(result.uri)
    }
  }

  function handleImageClear() {
    Alert.alert('Imagem do Usuário', 'Deseja limpar e restaurar a imagem padrão?', [
      {
        text: 'Não'
      },
      {
        text: 'Sim',
        onPress: () => imageSubmit('') 
      },
    ])
  }

  function handleImage() {
    Alert.alert(
      'Imagem do Usuário',
      '', 
      userImage 
      ? [
        {
          text: 'Limpar',
          onPress: handleImageClear
        },
        {
          text: 'Alterar',
          onPress: handleImageSelect
        },
        {
          text: 'Fechar'
        }
      ]
      : [
        {
          text: 'Escolher',
          onPress: handleImageSelect
        },
        {
          text: 'Fechar'
        }
      ]
    )
  }

  useEffect(() => {
    async function loadStorageUserName() {
      const user = await AsyncStorage.getItem('@plantmanager:user')
      setUserName(user || '')
    }

    loadStorageUserName()
  },[isFocused])

  useEffect(() => {
    async function loadStorageUserImage() {
      const userImage = await AsyncStorage.getItem(STORAGE_USER_IMAGE)
      setUserImage(userImage || '')
      setIsLoagingImage(false)
    }

    setIsLoagingImage(true)
    loadStorageUserImage()
  },[])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Precisamos de permissões de rolo da câmera para fazer isso funcionar!')
        }
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName }
          onPress={handleName}
        >
          {userName}
        </Text>
      </View>

      <TouchableOpacity 
        onPress={handleImageSelect} 
        onLongPress={handleImage}
      >
        {!isLoadingImage && 
          <Image 
            source={userImage ? {uri: userImage} : userImg}  
            style={styles.image}
          />
        }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },

  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },

  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
  }
})