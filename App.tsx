import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import SplashScreen from "./src/views/SplashScreen"
import LoginScreen from "./src/views/LoginScreen"
import StoreScreen from "./src/views/StoreScreen"
import { AuthProvider } from "./src/controllers/AuthController"
import { CartProvider } from "./src/controllers/CartController"
import { StatusBar } from "react-native"

const Stack = createStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Store" component={StoreScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

