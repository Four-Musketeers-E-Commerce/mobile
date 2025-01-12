import CustomButton from '@/components/CustomButton';
import { addItemsToCart, getWeapon, modifyViews } from '@/lib/appwrite';
import useAppWrite from '@/lib/useAppWrite';
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, Share } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

const Item = () => {
  const { query } = useLocalSearchParams();
  const { data } = useAppWrite(() => getWeapon(query));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onShare = async () => {
    try {
      const result = await Share.share({ message: "" });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {

        } else {

        }
      } else if (result.action === Share.dismissedAction) {

      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  const addToCart = async () => {
    setIsSubmitting(true);
    try {
      await addItemsToCart(query);
      Alert.alert("Success", "Item added successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const onOpenPage = async () => {
    await modifyViews(query);
  }

  useEffect(() => {
    if (query) {
      onOpenPage();
    }
  }, [query])

  return (
    <View className='bg-primary h-full'>
      <View className='w-full absolute top-[50px] z-10 px-4 flex-row items-center gap-1'>
        <TouchableOpacity
          className='w-8 h-8 justify-center items-center bg-gray-50/50 rounded-lg'
          onPress={() => { router.back() }}
        >
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <View className='flex-1' />
        <TouchableOpacity
          className='w-8 h-8 justify-center items-center bg-gray-50/50 rounded-lg'
          onPress={onShare}
        >
          <FontAwesome name="share" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className='w-8 h-8 justify-center items-center bg-gray-50/50 rounded-lg'
          onPress={() => { router.push("/(tabs)/shopping-cart") }}
        >
          <Feather name="shopping-cart" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ height: "80%" }}>
        <View className='w-full h-[35vh] mb-5'>
          <Image
            source={{ uri: data?.photo_url }}
            className='w-full h-full'
            resizeMode='contain'
          />
        </View>

        <View className='px-4'>
          <Text className='text-3xl font-pbold text-gray-50 mb-5'>
            {data?.weapon_name}
          </Text>

          <Text className='text-xl font-pregular text-gray-100'>
            {data?.description}
          </Text>
        </View>
      </ScrollView>
      <View className='w-full absolute bottom-10 px-4 justify-between items-center flex-row'>
        <Text className='text-2xl text-green-400 font-psemibold'>
          AUD ${data?.price}
        </Text>
        <CustomButton
          title="Add to Cart"
          containerStyles="px-4"
          handlePress={addToCart}
          isLoading={isSubmitting}
        />
      </View>
    </View>
  )
}

export default Item
