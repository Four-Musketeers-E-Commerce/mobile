import React, { useState } from 'react'
import { Image, TouchableOpacity, View, Text, Alert } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { addItemsToCart } from '@/lib/appwrite';

const WeaponCard = ({ item: {
  $id,
  weapon_name,
  photo_url,
  price
} }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onPress = () => {
    router.push(`/item/${$id}`);
  }

  const addToCart = async () => {
    setIsSubmitting(true);
    try {
      await addItemsToCart($id);
      Alert.alert("Success", "Item added successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TouchableOpacity
      className='w-full h-[128px] bg-blue-400/50 px-4 mb-7 rounded-lg'
      onPress={onPress}
      disabled={isSubmitting}
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

        <TouchableOpacity
          className='flex-col h-full justify-end'
          onPress={addToCart}
          disabled={isSubmitting}
        >
          <MaterialCommunityIcons name="cart-plus" size={30} color="orange" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default WeaponCard
