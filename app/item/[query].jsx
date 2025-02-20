import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Share 
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";

import CustomButton from "@/components/CustomButton";
import SubmitReview from "@/components/SubmitReview";
import WeaponComments from "@/components/WeaponComments";
import WriteComments from "@/components/WriteComments";
import LoadingIndicator from "@/components/LoadingIndicator";
import ViewHistory from "@/components/ViewHistory";

import { 
  addItemsToCart, 
  getWeapon, 
  modifyViews, 
  getViewHistory, 
  hasUserReviewed 
} from "@/lib/appwrite";
import useAppWrite from "@/lib/useAppWrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Item = () => {
  const { query } = useLocalSearchParams();
  const { data } = useAppWrite(() => getWeapon(query));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewed, setIsReviewed] = useState(null);
  const { isUpdated } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [editReviewData, setEditReviewData] = useState({ commentId: null, ratingId: null });
  const scrollViewRef = useRef(null);

  const isReviewedToggle = () => {
    setIsReviewed(!isReviewed);
  };

  // Update the handleEditStart function to include scrolling
  const handleEditStart = (reviewData) => {
    setEditReviewData(reviewData);
    setIsReviewed(false);
    
    // Scroll to the review section with a short delay to ensure state is updated
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ 
          y: 200, // Approximate position of review section - adjust as needed
          animated: true 
        });
      }
    }, 100);
  };

  const handleEditComplete = () => {
    setEditReviewData(null);
    setIsReviewed(true);
  };

  const handleCancelEdit = () => {
    setEditReviewData(null);
    setIsReviewed(true);
  };

  const checkIfReviewed = async () => {
    if(!query) return;
    setIsLoading(true);
    try{
      const reviewed = await hasUserReviewed(query);
      setIsReviewed(reviewed);
    }
    catch(error){
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({ message: "" });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const addToCart = async () => {
    setIsSubmitting(true);
    try {
      await addItemsToCart(query);
      Alert.alert("Success", "Item added successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOpenPage = async () => {
    await modifyViews(query);
  };

  useEffect(() => {
    if (query) {
      onOpenPage();
      checkIfReviewed();
    }
  }, [query, isUpdated]);

  return (
    <View className="bg-primary h-full">
      <LoadingIndicator isLoading={isSubmitting} />

      <View className="w-full absolute top-[50px] z-10 px-4 flex-row items-center gap-1">
        <TouchableOpacity
          className="w-8 h-8 justify-center items-center bg-gray-50/50 rounded-lg"
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <View className="flex-1" />
        <TouchableOpacity
          className="w-8 h-8 justify-center items-center bg-gray-50/50 rounded-lg"
          onPress={onShare}
        >
          <FontAwesome name="share" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-8 h-8 justify-center items-center bg-gray-50/50 rounded-lg"
          onPress={() => {
            router.push("/(tabs)/shopping-cart");
          }}
        >
          <Feather name="shopping-cart" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className='flex-1'>
        <ScrollView 
          ref={scrollViewRef} 
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className='w-full h-[35vh] mb-5'>
            <Image
              source={{ uri: data?.photo_url }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          <View className="px-4">
            <Text className="text-3xl font-pbold text-gray-50 mb-5">
              {data?.weapon_name}
            </Text>

            <Text className="text-xl font-pregular text-gray-100">
              {data?.description}
            </Text>
          </View>

          <SubmitReview 
            weaponId={query} 
            containerStyles="my-7"
            editData={editReviewData}
            onEditComplete={handleEditComplete}
            onCancelEdit={handleCancelEdit}
          />

          <WeaponComments 
            weaponId={query} 
            isReviewedToggle={isReviewedToggle}
            onEditStart={handleEditStart}
          />
          <ViewHistory />
        </ScrollView>
      </View>

      <View className='w-full bg-primary absolute bottom-0 px-4 pb-10 pt-2 justify-between items-center flex-row'>
        <Text className='text-2xl text-green-400 font-psemibold'>
          AUD ${data?.price}
        </Text>
        <CustomButton
          title="Add to Cart"
          containerStyles="px-4"
          handlePress={addToCart}
          isLoading={isSubmitting}
        />
      </View>
    </View>
  );
};

export default Item;
