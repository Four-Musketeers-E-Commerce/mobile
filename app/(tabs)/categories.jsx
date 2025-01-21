// Updated Category.js
import React, { useState } from 'react';
import { View, FlatList, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import WeaponCard from '@/components/WeaponCard';
import Header from '@/components/Header';
import LoadingIndicator from '@/components/LoadingIndicator';

const Category = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <LoadingIndicator isLoading={isSubmitting}/>
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryProducts={categoryProducts}
        setCategoryProducts={setCategoryProducts}
      />
      {selectedCategory ? (
        <FlatList
          data={categoryProducts[selectedCategory]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <WeaponCard
              item={item}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          )}
          className='px-4'
        />
      ) : (
        <FlatList
          data={Object.keys(categoryProducts)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className="pt-4">
              <View className="flex-row justify-between items-center px-4">
                <Text className="text-gray-100 text-lg font-psemibold">
                  {item.toUpperCase()}
                </Text>
                <TouchableOpacity onPress={() => setSelectedCategory(item)}>
                  <Text className="text-white text-sm font-psemibold underline">
                    View More
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={categoryProducts[item]?.slice(0, 2)}
                keyExtractor={(product) => product.$id}
                renderItem={({ item: product }) => (
                  <WeaponCard
                    item={product}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                  />
                )}
              />
            </View>
          )}
          className='px-4'
        />
      )}
    </SafeAreaView>
  );
};

export default Category;
