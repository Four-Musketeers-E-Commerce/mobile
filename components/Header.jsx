// HeaderComponent.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Animated,
  TextInput,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getAllWeapons } from '@/lib/appwrite';

const Header = ({
  selectedCategory,
  setSelectedCategory,
  categoryProducts,
  setCategoryProducts,
}) => {
    const [slideAnim] = useState(new Animated.Value(-300));
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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
      Alert.alert('Error', 'Failed to load categories!');
    }
  };

  const filterProducts = () => {
    if (searchQuery.trim()) {
      const filteredProducts = {};
      for (const category of categories) {
        filteredProducts[category] = categoryProducts[category]?.filter((product) =>
          product.weapon_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setCategoryProducts(filteredProducts);
    } else {
      fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery]);

  useEffect(() => {
    filterProducts();
  });
  const openMenu = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false); 
    });
  };

  return (
    <>
      <View className="flex-row items-center justify-between px-4 py-3 bg-black-100">
        <TouchableOpacity onPress={openMenu}>
          <MaterialCommunityIcons name="menu" size={30} color="#FFF" />
        </TouchableOpacity>

        {/* Dynamic Title */}
        <View className="flex-1 items-center">
          <Text className="text-secondary-200 text-lg font-bold">
            {selectedCategory ? selectedCategory.toUpperCase() : "ALL CATEGORIES"}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
        <View className="px-4 py-2 bg-black-200 mb-3">
          <TextInput
            className="bg-black-100 rounded-lg px-3 py-2 text-gray-100"
            placeholder="Search products..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

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
          className="absolute top-0 left-0 bg-black-100 h-full w-3/4 shadow-lg rounded-r-lg"
        >
          <SafeAreaView className="flex-1 p-5">
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(null);
                closeMenu();
              }}
              className="py-3"
            >
              <Text className="text-gray-100 text-xl font-psemibold mb-6 pl-2">
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
                className="py-3 border-b border-gray-700"
              >
                <Text className="text-white text-lg font-pmedium pl-4">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </SafeAreaView>
        </Animated.View>
      </Modal>
    </>
  );
};

export default Header;
