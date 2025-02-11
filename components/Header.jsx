// HeaderComponent.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Animated,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getAllWeapons } from "@/lib/appwrite";
import SearchInput from "./SearchInput";

const Header = ({
  selectedCategory,
  setSelectedCategory,
  setCategoryProducts,
}) => {
  const [slideAnim] = useState(new Animated.Value(-300));
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch weapons and group by category
  const fetchCategories = async () => {
    try {
      const weapons = await getAllWeapons();
      const grouped = weapons.reduce((acc, weapon) => {
        acc[weapon.weapon_type] = acc[weapon.weapon_type] || [];
        acc[weapon.weapon_type].push(weapon);
        return acc;
      }, {});

      setCategories(Object.keys(grouped));
      setCategoryProducts(grouped);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load categories!");
    }
  };

  useEffect(() => {
    fetchCategories();
  });

  const openMenu = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <View className="bg-primary w-full mt-16 px-4 pb-4">
      <View className="flex-row items-center justify-between bg-primary w-full">
        <TouchableOpacity onPress={openMenu}>
          <MaterialCommunityIcons name="menu" size={35} color="#FFF" />
        </TouchableOpacity>

        {/* Dynamic Title */}
        <View className="flex-1 items-center">
          <Text className="text-secondary-200 text-2xl font-bold">
            {selectedCategory
              ? selectedCategory.toUpperCase()
              : "ALL CATEGORIES"}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <SearchInput />

      {/* Categories Popup */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        {/* Background overlay */}
        <TouchableOpacity
          className="absolute inset-0 bg-black opacity-50"
          onPress={closeMenu}
        />

        {/* Sliding menu */}
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
          }}
          className="absolute top-0 left-0 bg-black-100 h-full w-1/2 shadow-lg rounded-r-lg"
        >
          <SafeAreaView className="flex-1 p-5">
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(null);
                closeMenu();
              }}
              className="py-3"
            >
              <Text className="text-secondary-200 text-2xl font-psemibold pl-4 mt-2">
                ALL CATEGORIES
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  setSelectedCategory(category);
                  closeMenu();
                }}
                className="py-3"
              >
                <Text className="text-gray-100 text-2xl font-pmedium pl-4">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </SafeAreaView>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default Header;
