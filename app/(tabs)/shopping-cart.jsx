import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { CartContext } from '../../context/CartContext';
import { router } from 'expo-router';



const ShoppingCart = () => {
  const { cartItems, getTotalQuantity, getTotalPrice, removeItemFromCart, decrementItemQuantity, incrementItemQuantity } = useContext(CartContext);

  const renderCartItem = ({ item }) => (
    <View>
    <TouchableOpacity
    style={styles.cartItem}
    onPress={() => { router.push(`/item/${item.id}`) }} // Use item.id here

    >
      <Image
        source={{ uri: item.photo_url }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.weapon_name}</Text>
        <Text style={styles.productPrice}>AUD ${item.price} x {item.quantity}</Text>
        <Text style={styles.itemSubtotal}>
          Subtotal: AUD ${(item.price * item.quantity).toFixed(2)}
        </Text>
      <View style={styles.quantityChangeButtons}>
        <TouchableOpacity
            style={styles.decrementButton}
            onPress={() => decrementItemQuantity(item.id)}
        >
          <Text style={styles.decrementButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.incrementButton}
            onPress={() => incrementItemQuantity(item.id)}
        >
          <Text style={styles.incrementButtonText}>+</Text>
        </TouchableOpacity>

      </View>

      {/* Delete button */}
    <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeItemFromCart(item.id)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </View>
);

  



  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Items: {getTotalQuantity()}</Text>
            <Text style={styles.totalText}>Total Price: AUD ${getTotalPrice()}</Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty!</Text>
        </View>
      )}
      {cartItems.length > 0 && (
      <View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => alert('Proceeding to checkout...')}>
          <Text style={styles.checkoutButtonText}>Check Out</Text>
        </TouchableOpacity>
      </View>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(96, 165, 250, 0.5)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  quantityChangeButtons: {
    flexDirection: 'row', // Ensure buttons are horizontally aligned
    alignItems: 'center', // Vertically center the buttons
    marginTop: 8,
    gap: 10, // Adds spacing between buttons (optional, or use marginHorizontal on buttons)
  },
  decrementButton: {
    paddingHorizontal: 8, // Add padding for clickable area
    paddingVertical: 4,
    backgroundColor: '#FF6B6B', // Red for decrement button
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementButton: {
    paddingHorizontal: 8, // Add padding for clickable area
    paddingVertical: 4,
    backgroundColor: '#1E90FF', // Blue for increment button
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  incrementButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  

  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '400',
    color: '#rgba(22, 163, 74, 1)',
    fontWeight: 'bold'
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginTop: 4,
  },


  totalContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#999',
  },
});

export default ShoppingCart;