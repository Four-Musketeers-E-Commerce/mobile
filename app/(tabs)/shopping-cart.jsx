import { Ionicons } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { addToOrder, clearCartItems, getAllCartItems, modifyCartItem } from '@/lib/appwrite'
import useAppWrite from '@/lib/useAppWrite'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import {router} from 'expo-router'

const ShoppingCart = () => {
  const { data, refetch } = useAppWrite(getAllCartItems);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const calTotalPrice = () => {
    const total = data?.reduce((total, item) => {
      return total + item.quantity * item.weapons.price
    }, 0) || 0;
    setTotalPrice(Number(total.toFixed(2)));
  }

  const modifyItemQuantity = async (weaponId, quantity) => {
    setIsLoading(true);
    try {
      await modifyCartItem(weaponId, quantity);
      await refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      if (!data.length) throw new Error("No items can be checked out");
      const weaponIds = data.map(item => item.weapons.$id);
      const quantities = data.map(item => item.quantity);
      await addToOrder(weaponIds, quantities, totalPrice);
      await clearCartItems();
      await refetch();
      Alert.alert("Success", "Checked out successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    refetch();
  }, []));

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    calTotalPrice();
  }, [data]);

  return (
    <View className='bg-primary h-full'>
      <View className='mt-12 p-4 flex-1'>
        <View className='flex-row items-center justify-between p-4 pl-1'>
        <Text className='w-full text-start text-2xl text-gray-100 font-psemibold'>
          Cart Items {' '}
          <Text className='text-lg text-gray-100 font-pmedium'>
            ({data ? data.length : 0})
          </Text>
        </Text>
        <TouchableOpacity onPress={async () => {
    try {
      await clearCartItems(); 
      await refetch();
      Alert.alert('Success', 'All items removed from the cart!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
      }}
        disabled={isLoading}
        style={{ marginLeft: -16 }}
        >
          <Ionicons name="trash-outline" size={24} color={isLoading ? 'gray' : 'white'} />
        </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {data && data.map(item => (
            <TouchableOpacity
              key={item.$id}
              onPress= {() => {
                router.push(`/item/${item.weapons.$id}`)}}
              className='bg-blue-400/50 w-full h-[124px] p-4 my-3 rounded-xl flex-row items-center gap-4'
            >
              <Image
                source={{ uri: item.weapons.photo_url }}
                className='w-[96px] h-[96px] rounded-xl'
                resizeMode='cover'
              />
              <View className='h-full flex-col justify-between'>
                <Text className='text-xl text-white font-pregular'>
                  {item.weapons.weapon_name}
                </Text>
                <View className='flex-row gap-1 items-center'>
                  <TouchableOpacity
                    className='w-6 h-6 justify-center items-center rounded-md bg-gray-100/70'
                    onPress={() => modifyItemQuantity(item.weapons.$id, item.quantity - 1)}
                    disabled={isLoading}
                  >
                    <Text className='text-xl text-black-100 font-pregular'>
                      -
                    </Text>
                  </TouchableOpacity>
                  <View className='w-6 h-6 justify-center items-center rounded-md bg-gray-100/70'>
                    <Text className='text-xl text-black-100 font-pregular'>
                      {item.quantity}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className='w-6 h-6 justify-center items-center rounded-md bg-gray-100/70'
                    onPress={() => modifyItemQuantity(item.weapons.$id, item.quantity + 1)}
                    disabled={isLoading}
                  >
                    <Text className='text-xl text-black-100 font-pregular'>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text className='text-2xl text-green-600 font-psemibold'>
                  $AUD {item.weapons.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View
        className='bg-primary w-full absolute bottom-0 p-4 flex-row items-center justify-between'
      >
        <Text className='text-xl text-gray-50 font-psemibold'>
          Total:{' '}
          <Text className='text-2xl text-secondary font-bold'>
            $AUD {totalPrice}
          </Text>
        </Text>
        <CustomButton
          title="Check Out"
          containerStyles="px-2"
          handlePress={handleCheckout}
          isLoading={isLoading}
        />
      </View>
    </View>
  )
}

export default ShoppingCart
