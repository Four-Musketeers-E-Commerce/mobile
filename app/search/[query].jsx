import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import useAppWrite from "@/lib/useAppWrite";
import { searchWeapon } from "@/lib/appwrite";
import WeaponCard from "@/components/WeaponCard";
import SearchInput from "@/components/SearchInput";
import AntDesign from "@expo/vector-icons/AntDesign";
import SearchHistory from "@/components/SearchHistory";
import LoadingIndicator from "@/components/LoadingIndicator";

const Search = () => {
  const { query } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { data: weapons, refetch } = useAppWrite(async () => {
    setIsLoading(true);
    const result = await searchWeapon(query);
    setIsLoading(false);
    return result;
  });

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <View className="bg-primary h-full space-y-4">
      <LoadingIndicator isLoading={isLoading} />
      <View className="w-full absolute mt-16 z-10 px-4 flex-row items-center justify-between">
        {/* <TouchableOpacity
          className="w-8 h-8 justify-center items-center"
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity> */}
        <View className="left-0 right-0 z-10 flex-1">
          <SearchInput initialQuery={query} refetch={refetch} />
        </View>
      </View>
      <FlatList
        data={weapons}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <WeaponCard item={item} />}
        ListHeaderComponent={() => (
          <>
            <View>
              <Text className="font-pmedium text-gray-100 text-xl mt-4">
                Search for
              </Text>
              <Text className="text-2xl font-psemibold text-secondary opacity-100 mt-2 mb-4">
                {query}
              </Text>
            </View>
          </>
        )}
        className="px-4 pt-24"
      />
    </View>
  );
};

export default Search;
