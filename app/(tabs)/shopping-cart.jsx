import CustomButton from '@/components/CustomButton'
import { addToOrder, clearCartItems, getAllCartItems, modifyCartItem } from '@/lib/appwrite'
import useAppWrite from '@/lib/useAppWrite'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import LoadingIndicator from '@/components/LoadingIndicator'

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
      if (!data.length) throw new Error("No items cna be checked out");
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

  const deleteAllItems = async () => {
    setIsLoading(true);
    try {
      await clearCartItems();
      await refetch();
      Alert.alert("Success", "All items removed successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    refreshData();
  }, []));

  useEffect(() => {
    refreshData();
  }, [])

  useEffect(() => {
    calTotalPrice();
  }, [data]);

  return (
    <View className='bg-primary h-full'>
      <LoadingIndicator isLoading={isLoading} />

      <View className='mt-12 p-4 flex-1'>
        <View className='w-full flex-row justify-between items-center'>
          <Text className='text-start text-2xl text-gray-100 font-psemibold'>
            Cart Items {' '}
            <Text className='text-lg text-gray-100 font-pmedium'>
              ({data ? data.length : 0})
            </Text>
          </Text>
          <TouchableOpacity
            className='flex justify-center items-center'
            onPress={deleteAllItems}
            disabled={isLoading}
          >
            <Text className='text-xl text-red-600 font-psemibold underline'>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {data && data.map(item => (
            <View
              key={item.$id}
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
                  <TouchableOpacity
                    className='w-6 h-6 ml-4 justify-center items-center rounded-md'
                    onPress={() => modifyItemQuantity(item.weapons.$id, 0)}
                    disabled={isLoading}
                  >
                    <Feather name="trash-2" size={20} color="red" />
                  </TouchableOpacity>
                </View>
                <Text className='text-2xl text-green-600 font-psemibold'>
                  $AUD {item.weapons.price}
                </Text>
              </View>
            </View>
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
