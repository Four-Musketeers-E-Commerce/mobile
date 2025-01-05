import React from 'react'
import { Image, TouchableOpacity, View, Text } from 'react-native'
import Feather from '@expo/vector-icons/Feather';

const WeaponCard = ({ item: {
  weapon_name,
  photo_url,
  description,
  price,
  weapon_type
} }) => {
  return (
    <TouchableOpacity
      className='w-full h-[128px] bg-blue-400/50 px-4 mb-7 rounded-lg'
    >
      <View className='flex-row py-4 gap-3 items-center'>
        <View className='w-[96px] h-[96px] rounded-lg'>
          <Image
            source={{ uri: photo_url }}
            className='w-full h-full rounded-lg'
            resizeMode='cover'
          />
        </View>

        <View className='flex-1'>
          <Text className='text-xl font-psemibold text-gray-50 mb-3'>
            {weapon_name}
          </Text>
          <Text className='text-lg font-psemibold text-green-600 mb-3'>
            AUD ${price}
          </Text>
        </View>

        <TouchableOpacity className='flex-col h-full justify-end'>
          <Feather name="shopping-cart" size={30} color="yellow" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default WeaponCard