import { Tabs } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className='justify-center items-center h-48'>
      {icon}
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs text-white text-center w-full mt-1`}
        numberOfLines={1}
        color={color}
        ellipsizeMode='clip'
      >
        {name}
      </Text>
    </View>
  );
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 70,
            paddingTop: 5,
            paddingBottom: 8
          }
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                name="Home"
                icon={<Entypo name="home" size={24} color={color} />}
              />
            )
          }}
        />
        <Tabs.Screen
          name='categories'
          options={{
            title: "Categories",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                name="Categories"
                icon={<Entypo name="menu" size={24} color={color} />}
              />
            )
          }}
        />
        <Tabs.Screen
          name='shopping-cart'
          options={{
            title: "ShoppingCart",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                name="ShoppingCart"
                icon={<FontAwesome name="shopping-cart" size={24} color={color} />}
              />
            )
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                focused={focused}
                name="Profile"
                icon={<MaterialCommunityIcons name="account" size={24} color={color} />}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout
