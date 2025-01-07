import React, { useEffect, useRef } from 'react'
import { View, Animated } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Logo = ({ size, isFirstPage }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFirstPage) {
      Animated.loop(
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 150,
            duration: 3000,
            useNativeDriver: true
          }),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            })
          ])
        ]),
        { resetBeforeIteration: true }
      ).start();
    }
  }, [isFirstPage, slideAnim, opacityAnim])

  return (
    <View
      key="logo"
      className='w-full flex-row items-start justify-start gap-5 my-4 px-5'
    >
      <FontAwesome6 name="gun" size={size} color="green" />
      {isFirstPage &&
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            opacity: opacityAnim
          }}
        >
          <MaterialCommunityIcons
            name="bullet"
            size={size / 2}
            color="red"
            className='rotate-90'
          />
        </Animated.View>
      }
    </View>
  )
}

export default Logo
