import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, TextInput, Alert } from "react-native";

import Fontisto from '@expo/vector-icons/Fontisto';

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex-row items-center h-10 w-full px-4 border-2 bg-black-100 rounded border-black-200 focus-within:border-secondary">
      <TextInput
        className="text-base text-white flex-1 font-pregular"
        value={query}
        placeholder="Search for weapons, types, or skins"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Please type something to search for",
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Fontisto name="search" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;