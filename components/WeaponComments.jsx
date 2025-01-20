import { getAllComments } from '@/lib/appwrite'
import useAppWrite from '@/lib/useAppWrite'
import React, { useEffect } from 'react'
import { Image, Text, View } from 'react-native'

const WeaponComments = ({ weaponId }) => {
  const { data, refetch } = useAppWrite(() => getAllComments(weaponId));

  useEffect(() => {
    async function fetchData() {
      await refetch();
    }
    fetchData();
  }, []);

  return (
    <>
      <View className="w-full px-4">
        <Text className='w-full text-start text-xl text-gray-300 font-psemibold mb-2'>
          Comments
        </Text>
        {data.length > 0 ? (
          data.map(item => (
            <View
              key={item.$id}
              className='w-full bg-blue-900 rounded-xl p-4 my-2'
            >
              <View className='flex-row items-center mb-2 gap-2'>
                <Image
                  source={{ uri: item.users.avatar }}
                  className='w-8 h-8 justify-center items-center border border-secondary rounded-full'
                  resizeMode='contain'
                />
                <Text className='text-xl text-secondary font-psemibold'>
                  {item.users.username}
                </Text>
              </View>
              <Text className='text-lg text-gray-50 font-pregular'>{item.comment}</Text>
            </View>
          ))
        ) : (
          <View className='w-full justify-center items-center'>
            <Text className='text-xl text-gray-100 font-pbold'>
              No Comments Yet
            </Text>
          </View>
        )}
      </View>
    </>
  )
}

export default WeaponComments
