"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useCart } from "../controllers/CartController"
import { useAuth } from "../controllers/AuthController"
import RadioButton from "../components/RadioButton"
import type { RootStackParamList } from "../types/navigation"

const formatNumber = (num: number) => {
  return num.toLocaleString("es-CL")
}

const CheckoutSimplificadoScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const [selectedPayment, setSelectedPayment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Calcular totales
  const total = cart.reduce((sum, item) => sum + (item.canjeado ? 0 : item.price * item.quantity), 0)
  const puntosAcumulados = cart.reduce((sum, item) => {
    if (!item.canjeado && item.points && item.points > 0) {
      return sum + item.points * item.quantity
    }
    return sum
  }, 0)

  const handleSubmit = async () => {
    if (!selectedPayment || !user) {
      Alert.alert("Error", "Por favor, selecciona un método de pago.", [{ text: "OK" }])
      return
    }

    setIsProcessing(true)

    try {
      const pedido = {
        user_id: user.id,
        total: Math.floor(total),
        points_used: cart.reduce((sum, item) => sum + (item.canjeado ? item.price * item.quantity : 0), 0),
        points_earned: puntosAcumulados,
        metodoPago: selectedPayment,
        status: "pending",
        order_items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          canjeado: item.canjeado || false,
        })),
      }

      console.log("Enviando pedido:", pedido)

      // Llamada real a la API
      const response = await fetch("http://134.209.125.62:80/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(pedido),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al procesar el pedido")
      }

      clearCart()
      Alert.alert("¡Pedido confirmado!", "Tu pedido ha sido generado correctamente.", [
        { text: "OK", onPress: () => navigation.navigate("Store") },
      ])
    } catch (error) {
      console.error("Error al procesar el pedido:", error)
      Alert.alert("Error", "Hubo un problema al procesar tu pedido. Por favor, intenta de nuevo.", [{ text: "OK" }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrintAndConfirm = async () => {
    if (!selectedPayment || !user) {
      Alert.alert("Error", "Por favor, selecciona un método de pago.", [{ text: "OK" }])
      return
    }

    setIsProcessing(true)

    try {
      const pedido = {
        user_id: user.id,
        total: Math.floor(total),
        points_used: cart.reduce((sum, item) => sum + (item.canjeado ? item.price * item.quantity : 0), 0),
        points_earned: puntosAcumulados,
        metodoPago: selectedPayment,
        status: "pending",
        order_items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          canjeado: item.canjeado || false,
        })),
      }

      console.log("Enviando pedido con impresión:", pedido)

      // Llamada real a la API con parámetro adicional para impresión
      const response = await fetch("http://134.209.125.62:80/api/orders?print=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(pedido),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al procesar el pedido")
      }

      clearCart()
      Alert.alert("¡Pedido confirmado!", "Tu pedido ha sido generado correctamente y las boletas han sido impresas.", [
        { text: "OK", onPress: () => navigation.navigate("Store") },
      ])
    } catch (error) {
      console.error("Error al procesar el pedido:", error)
      Alert.alert("Error", "Hubo un problema al procesar tu pedido. Por favor, intenta de nuevo.", [{ text: "OK" }])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Finalizar compra</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView>
          <View style={styles.content}>
            {/* Sección de métodos de pago */}
            <View style={styles.paymentSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="card-outline" size={24} color="#F47920" />
                <Text style={styles.sectionTitle}>Medios de pago</Text>
              </View>

              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioOption, selectedPayment === "tarjeta" && styles.radioOptionSelected]}
                  onPress={() => setSelectedPayment("tarjeta")}
                >
                  <RadioButton selected={selectedPayment === "tarjeta"} />
                  <Ionicons name="card-outline" size={24} color="#F47920" style={styles.radioIcon} />
                  <Text style={styles.radioText}>Pago con tarjeta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.radioOption, selectedPayment === "efectivo" && styles.radioOptionSelected]}
                  onPress={() => setSelectedPayment("efectivo")}
                >
                  <RadioButton selected={selectedPayment === "efectivo"} />
                  <Ionicons name="cash-outline" size={24} color="#F47920" style={styles.radioIcon} />
                  <Text style={styles.radioText}>Pago en efectivo en local</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Resumen del carrito */}
            <View style={styles.cartSummary}>
              <Text style={styles.summaryTitle}>Resumen del pedido</Text>

              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image
                    source={{ uri: item.image_url || "https://via.placeholder.com/60" }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      {item.canjeado ? `-${formatNumber(item.points || 0)} puntos` : `$${formatNumber(item.price)}`}
                    </Text>
                    {!item.canjeado && item.points && item.points > 0 && (
                      <Text style={styles.itemPoints}>Gana {formatNumber(item.points * item.quantity)} puntos</Text>
                    )}
                  </View>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
              ))}

              <View style={styles.totalSection}>
                {puntosAcumulados > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Puntos acumulados</Text>
                    <Text style={styles.totalPointsValue}>+{formatNumber(puntosAcumulados)} puntos</Text>
                  </View>
                )}

                {total > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total a pagar</Text>
                    <Text style={styles.totalValue}>${formatNumber(Math.floor(total))}</Text>
                  </View>
                )}
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.confirmButton, (!selectedPayment || isProcessing) && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={!selectedPayment || isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Confirmar pedido</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.printButton, (!selectedPayment || isProcessing) && styles.disabledButton]}
                  onPress={handlePrintAndConfirm}
                  disabled={!selectedPayment || isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Confirmar e imprimir</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  paymentSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  radioGroup: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  radioOptionSelected: {
    borderColor: "#F47920",
    backgroundColor: "rgba(244, 121, 32, 0.05)",
  },
  radioIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  radioText: {
    fontSize: 16,
  },
  cartSummary: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  itemPoints: {
    fontSize: 12,
    color: "#F47920",
    marginTop: 2,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalPointsValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F47920",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#F47920",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  printButton: {
    flex: 1,
    backgroundColor: "#4A67FF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default CheckoutSimplificadoScreen

