import { useGlobalContext } from '@/context/GlobalProvider'
import { signOut } from '@/lib/appwrite';
import { router } from 'expo-router';
import React from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomButton from '@/components/CustomButton';

const Profile = () => {
  const { setIsLoggedIn, user, setUser } = useGlobalContext();

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/(auth)/sign-in");
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center items-center px-4'>
          <TouchableOpacity
            className='w-full items-end mb-10'
            onPress={logOut}
          >
            <MaterialCommunityIcons name="exit-to-app" size={36} color="red" />
          </TouchableOpacity>

          <View className='flex-col items-center justify-center'>
            <View className='w-64 h-64 border border-secondary rounded-full justify-center items-center'>
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
