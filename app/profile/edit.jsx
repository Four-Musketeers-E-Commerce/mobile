import { useGlobalContext } from '@/context/GlobalProvider'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import * as ImagePicker from "expo-image-picker"
import Entypo from '@expo/vector-icons/Entypo';
import FormField from '@/components/FormField';
import { modifyProfile } from '@/lib/appwrite';

const Edit = () => {
  const { user, setUser } = useGlobalContext();
  const [form, setForm] = useState({
    username: user?.username || "",
    password: "",
    avatar: null
  });
  const [isNewAvatarPicked, setIsNewAvatarPicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setForm({ ...form, avatar: result.assets[0] })
      setIsNewAvatarPicked(true);
    }
  }

  const onUpdate = async () => {
    setIsSubmitting(true);
    try {
      const result = await modifyProfile(form.username, form.password, form.avatar, isNewAvatarPicked);
      setUser(result);
      Alert.alert("Success", "Profile modified successfully");
      router.replace("/(tabs)/profile");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        username: user?.username || "",
        password: "",
        avatar: null
      });
      setIsNewAvatarPicked(false);
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center items-center px-4'>
          <TouchableOpacity
            className='w-full items-start mb-10'
            onPress={() => { router.back() }}
          >
            <Entypo name="arrow-with-circle-left" size={36} color="red" />
          </TouchableOpacity>

          <View className='flex-col items-center justify-center'>
            <TouchableOpacity
              className='w-64 h-64 border border-secondary rounded-full justify-center items-center'
              onPress={openPicker}
            >
              <Image
                source={{ uri: form.avatar ? form.avatar.uri : user?.avatar }}
                className='w-[90%] h-[90%] rounded-full'
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>

          <FormField
            title="User Name"
            otherStyles="mt-7"
            handleTextChange={(e) => setForm({ ...form, username: e })}
          />

          <FormField
            title="Password"
            otherStyles="mt-7"
            handleTextChange={(e) => setForm({ ...form, password: e })}
          />

          <CustomButton
            title="Update"
            handlePress={onUpdate}
            containerStyles="w-full mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Edit
