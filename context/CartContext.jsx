import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItemFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Decrease item quantity by 1
  const decrementItemQuantity = (itemId) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
          : item
      )
      .filter((item) => item.quantity > 0); // Remove items with quantity 0

    });
  };
  const incrementItemQuantity = (itemId) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity + 1, 0) }
          : item
      )
    });
  };
  const getTotalQuantity = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItemFromCart,
        decrementItemQuantity,
        incrementItemQuantity,
        getTotalPrice,
        getTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
