"use client"

import type React from "react"
import { useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native"
import { ProductProvider, useProducts } from "../controllers/ProductController"
import { useCart } from "../controllers/CartController" // Remove CartProvider import
import { Ionicons } from "@expo/vector-icons"
import ProductQuantityControl from "../components/ProductQuantityControl"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../types/navigation"

// Update the Header component to use the typed navigation
const Header: React.FC = () => {
  const { cart } = useCart()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  // Calcular el total de items en el carrito
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <View style={styles.header}>
      <Image source={require("../assets/logo.png")} style={styles.headerLogo} resizeMode="contain" />
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const CategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useProducts()

  return (
    <View style={styles.categoryWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, selectedCategory === category.name && styles.selectedCategoryButton]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text style={[styles.categoryText, selectedCategory === category.name && styles.selectedCategoryText]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const formatNumber = (num: number) => {
  return num.toLocaleString("es-CL")
}

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart()

  // Find the item in the cart (if it exists)
  const cartItem = cart.find((item) => item.id === product.id)

  const handleAddToCart = (product: any, quantity: number) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image || product.image_url,
    })
  }

  return (
    <View style={styles.productCard}>
      <Image source={{ uri: product.image || product.image_url }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>${formatNumber(product.price)}</Text>
          <ProductQuantityControl
            product={product}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            initialQuantity={cartItem ? cartItem.quantity : 0}
          />
        </View>
      </View>
    </View>
  )
}

const ProductList: React.FC = () => {
  const { products, loading, selectedCategory } = useProducts()

  const filteredProducts = products.filter((product) => product.category === selectedCategory)

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F47920" />
      </View>
    )
  }

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={styles.productList}
    />
  )
}

const StoreScreenContent: React.FC = () => {
  const { fetchProducts } = useProducts()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <CategoryFilter />
        <ProductList />
      </SafeAreaView>
    </View>
  )
}

const StoreScreen: React.FC = () => {
  return (
    <ProductProvider>
      <StoreScreenContent />
    </ProductProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    ...Platform.select({
      ios: {
        marginTop: 3,
      },
      android: {
        marginTop: 35,
      },
    }),
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerIcons: {
    flexDirection: "row",
  },
  menuButton: {
    marginRight: 15,
  },
  cartButton: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#F47920",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  categoryWrapper: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  categoriesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F5F5F5",
    height: 40,
    justifyContent: "center",
  },
  selectedCategoryButton: {
    backgroundColor: "#333333",
  },
  categoryText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  productList: {
    padding: 8,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 0.5,
        borderColor: "rgba(0,0,0,0.1)",
      },
      android: {
        elevation: 2,
      },
    }),
  },
  productImage: {
    width: "100%",
    height: 200,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  productPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default StoreScreen

