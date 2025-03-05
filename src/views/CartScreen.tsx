"use client"

import type React from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../types/navigation"
import { Ionicons } from "@expo/vector-icons"
import { useCart } from "../controllers/CartController"
import { useAuth } from "../controllers/AuthController"

const formatNumber = (num: number) => {
  return num.toLocaleString("es-CL")
}

const CartScreen: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user } = useAuth()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  console.log("Cart items:", cart) // Add this for debugging

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.canjeado ? 0 : item.price * item.quantity), 0)
  const totalPoints = cart.reduce((sum, item) => sum + (item.canjeado ? item.points || 0 * item.quantity : 0), 0)

  const handleGoBack = () => {
    navigation.goBack()
  }

  const handleCheckout = () => {
    navigation.navigate("CheckoutSimplificado")
  }

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.image_url || "https://via.placeholder.com/60" }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {item.canjeado
            ? `${formatNumber(Math.floor(item.points || 0))} puntos`
            : `$${formatNumber(Math.floor(item.price))}`}
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
        >
          <Ionicons name="remove" size={16} color="#333" />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
          <Ionicons name="add" size={16} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
          <Ionicons name="trash-outline" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Ionicons name="cart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyCartText}>No hay productos en el carrito</Text>
      <TouchableOpacity style={styles.continueShoppingButton} onPress={handleGoBack}>
        <Text style={styles.continueShoppingText}>Continuar comprando</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Tu carrito</Text>
          {cart.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
              <Text style={styles.clearButtonText}>Vaciar</Text>
            </TouchableOpacity>
          )}
        </View>

        {cart.length > 0 ? (
          <>
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.cartList}
            />

            <View style={styles.footer}>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Productos:</Text>
                  <Text style={styles.summaryValue}>{totalItems}</Text>
                </View>

                {totalPoints > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total puntos:</Text>
                    <Text style={styles.summaryValue}>{formatNumber(Math.floor(totalPoints))} puntos</Text>
                  </View>
                )}

                {totalPrice > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total:</Text>
                    <Text style={styles.totalPrice}>${formatNumber(Math.floor(totalPrice))}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Proceder al pago</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          renderEmptyCart()
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    color: "#F47920",
    fontSize: 14,
  },
  cartList: {
    flexGrow: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666666",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 14,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FAFAFA",
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F47920",
  },
  checkoutButton: {
    backgroundColor: "#F47920",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 16,
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: "#F47920",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default CartScreen

