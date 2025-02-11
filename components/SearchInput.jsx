import { useState, useEffect } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, TextInput, Alert } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { saveSearchQuery, getCurrentUser } from "@/lib/appwrite";
import SearchHistory from "./SearchHistory";

const SearchInput = ({}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  const handleSearch = async () => {
    if (!query) {
      throw new Error("Please type something to search for");
    }
    setIsSubmitting(true);
    try {
      if (pathname.startsWith("/search")) {
        router.setParams({ query });
      } else {
        router.push(`/search/${query}`);
      }

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("No user found");
      }

      await saveSearchQuery(query);
      setIsFocused(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View>
      <View className="flex-row items-center h-10 w-full px-4 border-2 bg-black-100 rounded border-black-200 focus-within:border-secondary">
        <TextInput
          className="text-base text-white flex-1 font-pregular"
          value={query}
          placeholder="Search for weapons, types, or skins"
          placeholderTextColor="#CDCDE0"
          onChangeText={(e) => setQuery(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TouchableOpacity className="absolute right-4" onPress={handleSearch}>
          <Fontisto name="search" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search History appears below input when focused */}
      {isFocused && (
        <View className="absolute top-10 w-full bg-white rounded-b shadow-4xl opacity-100">
          <SearchHistory onBlur={() => setIsFocused(false)} />
        </View>
      )}
    </View>
  );
};

export default SearchInput;
