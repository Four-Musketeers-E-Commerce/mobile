import { useGlobalContext } from '@/context/GlobalProvider'
import { getAllOrders, signOut } from '@/lib/appwrite';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomButton from '@/components/CustomButton';
import useAppWrite from '@/lib/useAppWrite';

const Profile = () => {
  const { setIsLoggedIn, user, setUser } = useGlobalContext();
  const { data, refetch } = useAppWrite(getAllOrders);

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/(auth)/sign-in");
  }

  useFocusEffect(useCallback(() => {
    refetch();
  }, []))

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View className='bg-primary h-full px-4'>
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

        <View className='w-full mt-7'>
          <Text className='text-2xl text-gray-50 font-psemibold mb-2'>
            Orders
          </Text>
          {data && data.map(order => (
            <View
              key={order.$id}
              className='bg-blue-400/50 w-full h-auto rounded-lg p-2'
            >
              <View className='w-full flex-row items-center justify-between mb-3'>
                <Text className='text-base text-gray-50 font-psemibold'>
                  {new Date(order.$createdAt).toLocaleString()}
                </Text>
                <Text className='text-xl text-secondary font-pbold'>
                  $AUD {order.amount}
                </Text>
              </View>
              <View
                className='w-full flex-row items-center justify-between'
              >
                <Text className='w-[40%] text-lg text-secondary font-psemibold'>Product</Text>
                <Text className='w-[40%] text-lg text-secondary font-psemibold'>Price</Text>
                <Text className='w-[20%] text-lg text-secondary font-psemibold'>Quantity</Text>
              </View>
              {order.weapons.map((weapon, index) => (
                <View
                  key={index}
                  className='w-full flex-row items-center justify-between'
                >
                  <Text className='w-[40%] text-base font-pregular'>{weapon.weapon_name}</Text>
                  <Text className='w-[40%] text-base font-pregular'>$AUD {weapon.price}</Text>
                  <Text className='w-[40%] text-base font-pregular'>x{order.quantities[index]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default Profile
