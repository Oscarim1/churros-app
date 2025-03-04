"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  canjeado?: boolean
  canRedeem?: boolean
}

interface ProductQuantityControlProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  initialQuantity?: number
}

const ProductQuantityControl: React.FC<ProductQuantityControlProps> = ({
  product,
  onAddToCart,
  onUpdateQuantity,
  onRemove,
  initialQuantity = 0,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [showControls, setShowControls] = useState(initialQuantity > 0)

  useEffect(() => {
    if (initialQuantity > 0) {
      setQuantity(initialQuantity)
      setShowControls(true)
    } else {
      setQuantity(0)
      setShowControls(false)
    }
  }, [initialQuantity])

  const handleInitialAdd = () => {
    const newQuantity = 1
    setQuantity(newQuantity)
    setShowControls(true)
    onAddToCart(product, newQuantity)
  }

  const handleIncrement = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    onUpdateQuantity(product.id, newQuantity)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onUpdateQuantity(product.id, newQuantity)
    } else {
      handleRemove()
    }
  }

  const handleRemove = () => {
    setQuantity(0)
    setShowControls(false)
    onRemove(product.id)
  }

  return (
    <View>
      {!showControls ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleInitialAdd}
          disabled={product.canjeado && !product.canRedeem}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={quantity === 1 ? handleRemove : handleDecrement}>
            {quantity === 1 ? (
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            ) : (
              <Ionicons name="remove" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity style={styles.controlButton} onPress={handleIncrement}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#F47920",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F47920",
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    color: "white",
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
})

export default ProductQuantityControl

