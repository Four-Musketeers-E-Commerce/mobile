import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { ScrollView, StatusBar, Text, View } from 'react-native';
import Logo from '@/components/Logo';
import CustomButton from '@/components/CustomButton';


function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView
      className='bg-primary h-full'
    >
      <ScrollView
        contentContainerStyle={{ height: "100%" }}
      >
        <View
          className='w-full min-h-[85vh] items-center justify-center px-6'
        >
          <Logo
            size={120}
            isFirstPage={true}
          />
          <View
            className='w-full flex-col items-end px-5 relative -top-12'
          >
            <Text className='text-secondary-200 text-3xl italic font-bold'>
              Four Musketeers
            </Text>
            <Text className='text-gray-100 text-lg italic'>
              The Top End War Lord
            </Text>
          </View>
          <CustomButton
            title="Continue with Email"
            containerStyles="w-full mt-7"
            handlePress={() => { router.push("/(auth)/sign-in") }}
          />
        </View>
      </ScrollView>
      <StatusBar hidden={true}/>
    </SafeAreaView>
  )
}

export default App
