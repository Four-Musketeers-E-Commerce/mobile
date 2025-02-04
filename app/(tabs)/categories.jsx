import React, { useState } from 'react';
import { View, FlatList, ScrollView, TouchableOpacity, Text } from 'react-native';
import WeaponCard from '@/components/WeaponCard';
import Header from '@/components/Header';
import LoadingIndicator from '@/components/LoadingIndicator';


const Category = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);

  return (
    <View className="bg-primary h-full">
      <LoadingIndicator isLoading={isSubmitting} />
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
        <FlatList>
          <View className="px-4">
            <Text className="text-center text-4xl font-extrabold text-white tracking-wide">
              Search for CS2 skins for your weapon of choice
            </Text>
            <Text className="text-center text-2xl text-gray-200 mt-3 leading-relaxed">
              CS2 features a total of 53 weapons consisting of 10 pistols, 
              11 rifles, 7 SMGs, 6 heavy weapons, and 20 knives (excluding the default CT and T knives). 
              An assortment of over 1,000 <Text className="text-blue-300">CS2 skins</Text> are available 
              to customise these weapons.
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-center mb-10">
            {Object.keys(categoryProducts).map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedCategory(item)}
                className="bg-blue-600 py-3 w-2/5 m-2.5 rounded-lg items-center justify-center"
              >
                <Text className="text-white text-2xl font-psemibold text-center">
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
          data={Object.keys(categoryProducts)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className="pt-4">
              <View>
                <Text className="text-gray-100 text-4xl font-psemibold mb-2 border-t border-gray-400 pt-4 text-center">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </View>
              <FlatList
                className='px-4'
                data={categoryProducts[item]?.slice(0)}
                keyExtractor={(product) => product.$id}
                renderItem={({ item: product }) => (
                  <WeaponCard
                    item={product}
                  />
                )}
              />
            </View>
          )}
        /> 
        </FlatList>
      )}
    </View>
  );
};

export default Category;
