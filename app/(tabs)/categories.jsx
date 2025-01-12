import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { getAllWeapons, addItemsToCart } from '@/lib/appwrite';
import WeaponCard from '@/components/WeaponCard';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    fetchCategories();
  }, []);
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
      fetchCategories(); // Reset to original data when search query is cleared
    }
  };
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

  const handleAddToCart = async (weaponId) => {
    setIsSubmitting(true);
    try {
      await addItemsToCart(weaponId);
      Alert.alert('Success', 'Item added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
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

        {/* Search Button */}
        <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
          <AntDesign name="search1" size={24} color="#FFF" />
        </TouchableOpacity>
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
      
      {/* Products by Category */}
      {selectedCategory ? (
        <>
          <View className="flex-row justify-between items-center px-4 py-3">
            <Text className="text-gray-100 text-xl font-psemibold">
              {selectedCategory.toUpperCase()}
            </Text>
          </View>
          <FlatList
          data={categoryProducts[selectedCategory]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <WeaponCard
              item={item}
            />
          )}/>
          {/* <FlatList
            data={categoryProducts[selectedCategory]}
            keyExtractor={(item) => item.$id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View className="bg-black-100 rounded-lg m-2 p-3">
                <Image
                  source={{ uri: item.photo_url }}
                  className="w-36 h-36 rounded-lg"
                  resizeMode="cover"
                />
                <View className="mt-2">
                  <Text className="text-gray-100 font-psemibold text-sm">
                    {item.weapon_name}
                  </Text>
                  <Text className="text-green-600 font-pbold text-base">
                    AUD ${item.price}
                  </Text>
                </View>
                
                
                <TouchableOpacity
                  className={`flex-row items-center justify-center mt-3 py-2 px-3 rounded-lg bg-secondary ${
                    isSubmitting ? 'opacity-50' : ''
                  }`}
                  onPress={() => handleAddToCart(item.$id)}
                  disabled={isSubmitting}
                >
                  <MaterialCommunityIcons
                    name="cart-plus"
                    size={20}
                    color="black"
                  />
                  <Text className="text-black font-pbold ml-2">Add to Cart</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
          /> */}
        </>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className="mb-6">
              <View className="flex-row justify-between items-center px-4">
                <Text className="text-gray-100 text-lg font-psemibold">
                  {item.toUpperCase()}
                </Text>
                <TouchableOpacity>
                  <Text className="text-white text-sm font-psemibold underline">
                    View More
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={categoryProducts[item]?.slice(0, 2)}
                keyExtractor={(product) => product.$id}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}
                renderItem={({ item: product }) => (
                  <TouchableOpacity
                  onPress={() => { router.push(`/item/${product.$id}`) }}
                  disabled={isSubmitting}>
                  <View className="bg-black-100 rounded-lg m-2 p-3">
                    <Image
                      source={{ uri: product.photo_url }}
                      className="w-36 h-36 rounded-lg"
                      resizeMode="cover"
                    />
                    <View className="mt-2">
                      <Text className="text-gray-100 font-psemibold text-sm">
                        {product.weapon_name}
                      </Text>
                      <Text className="text-green-600 font-pbold text-base">
                        AUD ${product.price}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className={`flex-row items-center justify-center mt-3 py-2 px-3 rounded-lg bg-secondary ${
                        isSubmitting ? 'opacity-50' : ''
                      }`}
                      onPress={() => handleAddToCart(product.$id)}
                      disabled={isSubmitting}
                    >
                      <MaterialCommunityIcons
                        name="cart-plus"
                        size={20}
                        color="black"
                      />
                      <Text className="text-black font-pbold ml-2">
                        Add to Cart
                      </Text>
                    </TouchableOpacity>
                  </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Category;