import { useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import useAppWrite from "@/lib/useAppWrite";
import { searchWeapon } from "@/lib/appwrite";
import WeaponCard from "@/components/WeaponCard";
import SearchInput from "@/components/SearchInput";
import AntDesign from "@expo/vector-icons/AntDesign";


const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: weapons, refetch } = useAppWrite(() => searchWeapon(query));
  

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <View className="bg-primary h-full">
        <View className='w-full absolute mt-16 z-10 px-4 flex-row items-center justify-between'>
            <TouchableOpacity
                className='w-8 h-8 justify-center items-center bg-gray-50/50 rounded-lg'
                onPress={() => { router.back() }}
            >
            <AntDesign name="left" size={20} color="white" />
            </TouchableOpacity>
        </View>
        <View>
            <FlatList
            data={weapons}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
            <WeaponCard item={item}/>
            )}
            ListHeaderComponent={() => (
                <>
                    <View>
                        <View>
                            <SearchInput initialQuery={query} refetch={refetch} />
                        </View>
                        <Text className="font-pmedium text-gray-100 text-xl mt-4">
                            Search for
                        </Text>
                        <Text className="text-2xl font-psemibold text-secondary opacity-100 mt-2 mb-4">
                            {query}
                        </Text>

                    </View>
                </>
            )}
            className="px-4 top-[90px]"
            />
        </View>
    </View>
  );
};

export default Search;