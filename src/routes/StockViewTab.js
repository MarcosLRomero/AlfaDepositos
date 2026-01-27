import Account from "@db/Account";
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useCart } from '../hooks/useCart';
import CartScreen from '../screens/Orders/CartScreen';

import { Alert, BackHandler } from 'react-native';
import ResumeCartScreen from '../screens/Orders/ResumeCartScreen';
import SelectAccountScreen from '../screens/Orders/SelectAccountScreen';

const renderScene = SceneMap({
    proveedor: SelectAccountScreen,
    articulos: CartScreen,
    resumeCart: ResumeCartScreen,
});

const routes = [
    { key: 'proveedor', title: 'PROVEEDOR' },
    { key: 'articulos', title: 'ARTICULOS' },
    { key: 'resumeCart', title: 'RESUMEN' },
];


export default function StockViewTab({ navigation, route }) {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);

    const { id = null, account = null } = route?.params || {}

    const { loadEditOrder, addAccount } = useCart();

    // console.log(route)
    // console.log(id, account)

    const loadAccount = async () => {
        const account = await Account.findBy({ code_eq: account });

        addAccount({
            code: account?.code,
            name: account?.name,
            priceClass: account?.price_class,
            lista: account?.lista,
        })
    }

    useEffect(() => {
        if (account) {
            loadAccount()
        }
    }, [account])

    useEffect(() => {
        if (id) {
            const loadOrder = async (orderId) => {
                await loadEditOrder(orderId)
            }

            loadOrder(id)
        }
    }, [id])


    useEffect(() => {
        const onBackPress = () => {
            Alert.alert(
                'Cancelar carga de comprobante',
                '¿Está seguro que desea cancelar la carga del comprobante?',
                [
                    {
                        text: 'Continuar',
                        onPress: () => {
                            // Do nothing
                        },
                        style: 'cancel',
                    },
                    { text: 'Si, Cancelar', onPress: () => navigation.goBack() },
                ],
                { cancelable: false }
            );

            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);

    return (
        // <CartProvider>

        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
        // </CartProvider>

    );
}