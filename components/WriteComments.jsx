import React, { useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addComments } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const WriteComments = ({ weaponId, containerStyles }) => {
  const {setIsUpdated} = useGlobalContext();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      if (comment === "") throw new Error("Please write a comment before submitting");
      await addComments(weaponId, comment);
      Alert.alert("Success", "Comment added successfully");
      setIsUpdated(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setComment("");
      setIsSubmitting(false);
    }
  }

  return (
    <View className={`w-full px-4 flex-col gap-2 items-center ${containerStyles}`}>
      <Text className='text-xl text-gray-300 font-psemibold w-full text-start'>
        Leave a comment
      </Text>
      <View className='w-full border border-gray-100 rounded-lg flex-col'>
        <TextInput
          value={comment}
          placeholder='Share something ...'
          placeholderTextColor="orange"
          onChangeText={(e) => setComment(e)}
          multiline
          numberOfLines={4}
          className='w-full text-lg text-gray-100 font-psemibold p-2 h-[80px]'
        />
      </View>
      <View className='w-full items-end'>
        <TouchableOpacity
          className='w-9 h-9 justify-center items-center bg-secondary rounded-lg'
          activeOpacity={0.7}
          onPress={submit}
          disabled={isSubmitting}
        >
          <FontAwesome name="paper-plane" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default WriteComments
