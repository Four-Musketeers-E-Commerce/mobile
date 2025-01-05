import WeaponCard from '@/components/WeaponCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getAllWeapons } from '@/lib/appwrite'
import useAppWrite from '@/lib/useAppWrite'
import React, { useState } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const { user } = useGlobalContext();
  const { data: weaponData, refetch } = useAppWrite(getAllWeapons);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <View className='bg-primary h-full flex-1'>
      <FlatList
        data={weaponData}
        keyExtractor={item => item.$id}
        renderItem={({ item }) => (
          <WeaponCard
            item={item}
          />
        )}
        ListHeaderComponent={() => (
          <View className='mt-12 mb-4 px-4 space-y-6'>
            <View className='flex-row justify-between items-start mb-6'>
              <View className='mb-6'>
                <Text className='font-psemibold text-base text-gray-100'>
                  Welcome back,
                </Text>
                <Text className='font-semibold text-4xl text-secondary'>
                  {user?.username}
                </Text>
              </View>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  )
}

export default Home
