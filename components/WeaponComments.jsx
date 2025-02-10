  import { useGlobalContext } from '@/context/GlobalProvider';
  import { getAllCommentsAndRatings } from '@/lib/appwrite';
  import useAppWrite from '@/lib/useAppWrite';
  import React, { useEffect } from 'react';
  import { Image, Text, View } from 'react-native';
  import StarRatingShowing from './StarRatingDisplay';

  const WeaponComments = ({ weaponId }) => {
    const { isUpdated, setIsUpdated } = useGlobalContext();
    const { data, refetch } = useAppWrite(() => getAllCommentsAndRatings(weaponId));

    async function fetchData() {
      await refetch();
    }

    useEffect(() => {
      fetchData();
    }, []);

    useEffect(() => {
      if (isUpdated) {
        fetchData();
        setIsUpdated(false);
      }
    }, [isUpdated]);

    return (
      <View className="w-full px-4">
        <Text className="w-full text-start text-xl text-gray-300 font-psemibold mb-2">
          Comments
        </Text>

        {data.length > 0 ? (
          data.map((item) => (
            <View key={item.$id} className="w-full bg-blue-400/50 rounded-xl p-4 my-2">
              <View className="flex-row items-center mb-2 gap-2">
                <Image
                  source={{ uri: item.users?.avatar || 'https://via.placeholder.com/40' }}
                  className="w-8 h-8 border border-secondary rounded-full"
                  resizeMode="contain"
                />
                <Text className="text-xl text-secondary font-psemibold">
                  {item.users?.username || 'Anonymous'}
                </Text>
              </View>
              
              {item.rating !== null && <StarRatingShowing rating={item.rating} />}

              <Text className="text-lg text-gray-50 font-pregular">{item.comment}</Text>
            </View>
          ))
        ) : (
          <View className="w-full justify-center items-center">
            <Text className="text-xl text-gray-100 font-pbold">No Comments Yet</Text>
          </View>
        )}
      </View>
    );
  };

  export default WeaponComments;
