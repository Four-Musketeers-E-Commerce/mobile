import React from "react";
import { View, Text } from "react-native";

const OrderHistory = ({ orders }) => {
  return (
    <>
      <View className="w-full mt-7">
        <Text className="text-2xl text-gray-50 font-psemibold mb-2">
          Orders
        </Text>
        {orders &&
          orders.map((order) => (
            <View
              key={order.$id}
              className="bg-blue-400/50 w-full h-auto rounded-lg p-4 my-2"
            >
              <View className="w-full flex-row items-center justify-between mb-3">
                <Text className="text-base text-gray-50 font-psemibold">
                  {new Date(order.$createdAt).toLocaleString()}
                </Text>
                <Text className="text-xl text-green-600 font-pbold">
                  $AUD {order.amount}
                </Text>
              </View>
              <View className="w-full flex-row items-center justify-between">
                <Text className="w-[40%] text-lg text-secondary font-psemibold">
                  Product
                </Text>
                <Text className="w-[30%] text-lg text-secondary font-psemibold">
                  Price
                </Text>
                <Text className="w-[30%] text-lg text-secondary font-psemibold">
                  Quantity
                </Text>
              </View>
              {order.weapons.map((weapon, index) => (
                <View
                  key={index}
                  className="w-full flex-row items-center justify-between"
                >
                  <Text className="w-[40%] text-base font-psemibold">
                    {weapon.weapon_name}
                  </Text>
                  <Text className="w-[30%] text-base font-pregular">
                    $ {weapon.price}
                  </Text>
                  <Text className="w-[30%] text-base font-pregular">
                    x {order.quantities[index]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
      </View>
    </>
  );
};

export default OrderHistory;
