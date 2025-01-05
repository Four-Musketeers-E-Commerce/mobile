import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather';

const FormField = ({ title, value, placeholder, handleTextChange, otherStyles, ...props }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>
        {title}
      </Text>
      <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl 
      focus:border-secondary items-center flex-row'>
        <TextInput
          className='flex-1 text-white font-psemibold text-base'
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#ddd"
          onChangeText={handleTextChange}
          secureTextEntry={title === "Password" && !isShowPassword}
          autoCapitalize='none'
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setIsShowPassword(!isShowPassword)}
          >
            {!isShowPassword ?
              <Feather name="eye-off" size={24} color="#ddd" /> :
              <Feather name="eye" size={24} color="#ddd" />
            }
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
