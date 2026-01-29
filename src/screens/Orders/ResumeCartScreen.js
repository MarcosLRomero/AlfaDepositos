import { useCart } from '@hooks/useCart';
import { useEffect } from 'react';
import { ActivityIndicator, Button, FlatList, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ItemResumeCart from '../../components/Cart/ItemResumeCart';
import Colors from '../../styles/Colors';
import { getFontSize } from '../../utils/Metrics';
import { useNavigation } from '@react-navigation/native';
export default function ResumeCartScreen({ jumpTo }) {
    // const [estado, setEstado] = useState({ error: false, message: null })
    const { cartItems, getTotal, getSubtotal, account, getDetalleIva, save, getTotalDiscount, status, isSaving } = useCart();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const formatAmount = (value) => {
        const num = Number.parseFloat(value);
        if (!Number.isFinite(num)) return "0,00";
        return new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    const handleSaveOrder = () => {
        Alert.alert(
            'Compartir comprobante',
            '¿Desea compartir el comprobante generado?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {
                        // Si el usuario cancela la alerta, no hacemos nada o cerramos
                    },
                    style: 'cancel',
                },
                {
                    text: 'Compartir',
                    onPress: async () => {
                        await save(true, false); // Esperamos a que guarde
                        // navigation.navigate("HomeStack"); // Redirigimos
                    },
                    style: 'default',
                },
                {
                    text: 'Solo generar',
                    onPress: async () => {
                        await save(false, false); // Esperamos a que guarde
                        // navigation.navigate("HomeStack"); // Redirigimos
                    }
                },
            ],
            { cancelable: false }
        );
    }

    if (!account) {
        return <View style={{ flex: 1, paddingHorizontal: 10, marginTop: 20, display: "flex" }}>
            <Text
                style={{
                    fontSize: 15,
                    marginBottom: 20,
                    marginTop: 30,
                    backgroundColor: "orange",
                    textAlign: "center"
                }}
            >
                Seleccione un proveedor para comenzar</Text>
            <Button style={{ marginTop: 10 }} onPress={() => jumpTo("proveedor")} title='Seleccionar proveedor' />
        </View>
    }

    if (cartItems?.length == 0) {
        return <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            <Text>Actualmente no tiene articulos en su carrito</Text>
        </View>
    }

    return (
        <View style={{ position: "relative", height: "100%" }}>
            {/* <Text>ResumeCartScreen</Text> */}
            <FlatList
                style={{ backgroundColor: "white", paddingHorizontal: 6, width: "100%" }}
                ListFooterComponent={<View />}
                ListFooterComponentStyle={{ height: 200 }}
                scrollEnabled={true}
                data={cartItems}
                keyExtractor={(item) => item.code + ""}
                renderItem={({ item }) => {
                    return (
                        <ItemResumeCart item={item} />
                    );
                }}
            />

            <View style={{ position: "absolute", width: "100%", minHeight: 100, backgroundColor: "#dddddd", bottom: 0, zIndex: 99, paddingVertical: 5, paddingBottom: 5 + (insets?.bottom || 0) }}>
                <View style={{ width: "100%", paddingHorizontal: 10 }}>

                    {(status?.message && status?.error) && <Text style={{ color: "white", backgroundColor: status?.error ? Colors.RED : Colors.GREEN, width: "100%", textAlign: "center", padding: 5 }}>{status.message}</Text>}

                    <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", borderBottomColor: "#bebebe", borderBottomWidth: 1, paddingVertical: 3 }}>
                        <Text style={{ fontSize: getFontSize(15) }}>SUBTOTAL</Text>
                        <Text style={{ fontSize: getFontSize(15) }}>${formatAmount(getSubtotal())}</Text>
                    </View>

                    <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", borderBottomColor: "#bebebe", borderBottomWidth: 1, paddingVertical: 3 }}>
                        <Text style={{ fontSize: getFontSize(15) }}>DESCUENTO</Text>
                        <Text style={{ fontSize: getFontSize(15) }}>${formatAmount(getTotalDiscount())}</Text>
                    </View>

                    {getDetalleIva()?.map((item, idx) => (
                        <View key={`iva_${idx}`} style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", borderBottomColor: "#bebebe", borderBottomWidth: 1, paddingVertical: 3 }}>
                            <Text style={{ fontSize: getFontSize(15) }}>IVA {item.iva}%</Text>
                            <Text style={{ fontSize: getFontSize(15) }}>${formatAmount(item.importe)}</Text>
                        </View>
                    ))}

                    <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row" }}>
                        <Text style={{ fontSize: getFontSize(20), fontWeight: "bold" }}>TOTAL</Text>
                        <Text style={{ fontSize: getFontSize(20), fontWeight: "bold" }}>${formatAmount(getTotal())}</Text>
                    </View>
                </View>

                <TouchableOpacity disabled={isSaving} onPress={() => handleSaveOrder()} style={{ width: "100%", marginTop: 10 }}>
                    {isSaving ?
                        <View style={{ flexDirection: "row", width: "100%", backgroundColor: Colors.GREEN, padding: 10, alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator size="small" />
                            <Text style={{ textAlign: "center", fontSize: getFontSize(18), fontWeight: "600", color: "white", marginLeft: 5 }}>GENERANDO</Text>
                        </View>
                        :
                        <Text style={{ textAlign: "center", fontSize: getFontSize(18), fontWeight: "600", backgroundColor: Colors.GREEN, color: "white", padding: 10 }}>RECEPCIONAR</Text>
                    }
                </TouchableOpacity>

            </View>
        </View>
    )
}
