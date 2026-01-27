import { useCart } from '@hooks/useCart';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getFontSize } from '../../utils/Metrics';

export default function FooterTotal() {
    const { getTotal, cartItems } = useCart();
    const [total, setTotal] = useState(0)

    useEffect(() => {
        setTotal(getTotal())
    }, [cartItems])

    return (
        <View style={{ backgroundColor: "red", zIndex: 99, display: "flex", flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10, alignItems: "center", justifyContent: "center", position: "absolute", bottom: 0, backgroundColor: "#f1f1f1", borderTopColor: "gray", borderTopWidth: 1, width: "100%" }}>
            <Text style={{ fontSize: getFontSize(22), fontWeight: "500", width: "100%", textAlign: "center" }}>TOTAL : $ {total}</Text>
            {/* <TouchableOpacity onPress={() => clearCart()} style={{ backgroundColor: "#f58383", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 5 }}>
                <Text style={{ fontSize: getFontSize(20) }}>Vaciar</Text>
            </TouchableOpacity> */}
        </View>
    )
}