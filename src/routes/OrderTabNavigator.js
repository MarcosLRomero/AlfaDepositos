import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartProvider } from '../hooks/useCart';
import CartScreen from '../screens/Orders/CartScreen';
import SelectAccountScreen from '../screens/Orders/SelectAccountScreen';
import ResumeCartScreen from '../screens/Orders/ResumeCartScreen';
import { Ionicons } from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

const OrderTabNavigator = () => {
    return (
        <CartProvider>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        // Aquí puedes personalizar el ícono según la pantalla
                        if (route.name === 'Cliente') {
                            iconName = 'person';  // Ícono de cliente
                        } else if (route.name === 'Articulos') {
                            iconName = 'cart';  // Ícono de carrito
                        } else if (route.name === 'Finalizar') {
                            iconName = 'save';  // Ícono de carrito
                        }
                        return <Ionicons name={iconName} size={25} color={color} />;
                    },
                })}
            >

                <Tab.Screen name="Cliente" component={SelectAccountScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Articulos" component={CartScreen} options={{ headerShown: false, lazy: true }} />
                <Tab.Screen name="Finalizar" component={ResumeCartScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
        </CartProvider>
    );
};

export default OrderTabNavigator;