import { CartProvider } from '../hooks/useCart'
import StockViewTab from './StockViewTab'
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function CartStockContainer({ route, navigation }) {
    // console.log(route.params)
    return (
        <CartProvider>
            <StockViewTab route={route} navigation={navigation} />
        </CartProvider>
    )
}
