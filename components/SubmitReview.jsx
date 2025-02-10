import React, { useState } from 'react';
import { Alert, View, TouchableOpacity, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addComments, addStarRating } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import WeaponRatingInput from './WeaponRating';
import WriteComments from './WriteComments';

const SubmitReview = ({ weaponId, containerStyles }) => {
  const { setIsUpdated } = useGlobalContext();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async () => {
    setIsSubmitting(true);
    try {
      if (rating === 0) throw new Error('Please select a rating');
      if (comment.trim() === '') throw new Error('Please write a comment before submitting');

      await addStarRating(weaponId, rating);
      await addComments(weaponId, comment);
      Alert.alert('Success', 'Review submitted successfully');
      setIsUpdated(true);

      // Reset fields after submission
      setComment('');
      setRating(0);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className={`w-full px-4 flex-col gap-4 items-center ${containerStyles}`}>
        <Text className="text-xl text-gray-300 font-psemibold w-full text-start">
            How was this product?
        </Text>
            <WeaponRatingInput rating={rating} setRating={setRating} />
        <Text className="text-xl text-gray-300 font-psemibold w-full text-start">
            Leave a comment
        </Text>
        
        <WriteComments comment={comment} setComment={setComment} />

     <View className="w-full items-end">
        <TouchableOpacity
          className="w-9 h-9 justify-center items-center bg-secondary rounded-lg"
          activeOpacity={0.7}
          onPress={submitReview}
          disabled={isSubmitting}
        >
          <FontAwesome name="paper-plane" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SubmitReview;
