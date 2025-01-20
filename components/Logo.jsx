import React from 'react'
import { Image, View } from 'react-native'
import badge from '@/assets/images/four-musketeers.png'

const Logo = ({ containerStyles }) => {
  return (
    <View className={`justify-center items-center ${containerStyles}`}>
      <Image
        source={badge}
        className='w-[90%] h-[90%]'
        resizeMode='contain'
      />
    </View>
  );
}

export default Logo
