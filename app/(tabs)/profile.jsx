import { useGlobalContext } from '@/context/GlobalProvider'
import { getAllOrders, signOut } from '@/lib/appwrite';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomButton from '@/components/CustomButton';
import useAppWrite from '@/lib/useAppWrite';
import OrderHistory from '@/components/OrderHistory';
import LoadingIndicator from '@/components/LoadingIndicator';

const Profile = () => {
  const { setIsLoggedIn, user, setUser } = useGlobalContext();
  const { data: orders, refetch } = useAppWrite(getAllOrders);
  const [isLoading, setIsLoading] = useState(false);

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/(auth)/sign-in");
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
  }, []))

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <View className='bg-primary h-full px-4'>
      <LoadingIndicator isLoading={isLoading} />
      <ScrollView>
        <View className='w-full justify-center items-center px-4 mt-12'>
          <TouchableOpacity
            className='w-full items-end mb-10'
            onPress={logOut}
          >
            <MaterialCommunityIcons name="exit-to-app" size={36} color="red" />
          </TouchableOpacity>

          <View className='flex-col items-center justify-center'>
            <View className='w-48 h-48 border border-secondary rounded-full justify-center items-center'>
              <Image
                source={{ uri: user?.avatar }}
                className='w-[90%] h-[90%] rounded-full'
                resizeMode='contain'
              />
            </View>
            <CustomButton
              title="Edit Profile"
              handlePress={() => { router.push("/profile/edit") }}
              containerStyles="mt-5 px-4"
            />
          </View>
        </View>

        <OrderHistory orders={orders} />
      </ScrollView>
    </View>
  )
}

export default Profile
