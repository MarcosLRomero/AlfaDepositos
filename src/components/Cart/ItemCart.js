import { useCart } from '@hooks/useCart';
import imgProduct from "@icons/product2.png";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getFontSize } from "../../utils/Metrics";
import { useEffect, useState } from 'react';
import ModalItem from './ModalItem';
import ProductImage from '../ProductImage';

export default function ItemCart({ item, priceClass }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { addToCart, noPermiteDuplicarItem, decreaseQuantity, loadImages, getCurrentQuantity, removeFromCart, setGlobalPriceClass } = useCart();

    // Al montar el componente o si cambia priceClass, lo seteamos globalmente
    useEffect(() => {
        setGlobalPriceClass(priceClass);
    }, [priceClass]);

    const priceKey = `price${priceClass}`;
    const priceToShow = item[priceKey] ?? 0;
    const quantity = getCurrentQuantity(item.code);

    return (
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={{ marginBottom: 10, backgroundColor: "white", flexDirection: "row", paddingHorizontal: 1 }}>
            <ModalItem isVisible={isModalVisible} setIsVisible={setIsModalVisible} item={item} />

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                {/* <Image source={imgProduct}></Image> */}
                <ProductImage cancelaCarga={!loadImages} fileName={item?.code} widthImage={80} heightImage={80} />

            </View>

            <View style={{ flex: 3, paddingVertical: 4 }}>
                <Text style={{ fontSize: getFontSize(12) }}>#{item?.code}</Text>
                <Text style={{ fontSize: getFontSize(16) }}>{item?.name}</Text>
                <Text style={{ fontSize: getFontSize(20), fontWeight: "600" }}>$ {priceToShow}</Text>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: quantity > 0 ? "space-between" : "flex-end" }}>
                    {quantity > 0 && (
                        <TouchableOpacity onPress={() => removeFromCart(item.code)} style={{ backgroundColor: "red", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5 }}>
                            <Text style={{ fontSize: getFontSize(14), color: "white" }}>Eliminar</Text>
                        </TouchableOpacity>
                    )}

                    {!noPermiteDuplicarItem ?
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginRight: 10, paddingVertical: 5 }}>
                            <TouchableOpacity onPress={() => decreaseQuantity(item.code)} style={{ borderWidth: 1, borderColor: "gray", borderRadius: 20 }}>
                                <Text style={{ paddingHorizontal: 15, fontWeight: "bold", paddingVertical: 5, fontSize: getFontSize(20) }}>-</Text>
                            </TouchableOpacity>

                            <Text style={{ fontSize: getFontSize(20), textAlign: "center", fontWeight: "bold", paddingHorizontal: 10, minWidth: 70 }}>{quantity}</Text>

                            <TouchableOpacity onPress={() => addToCart(item, 1, 0, priceClass)} style={{ borderWidth: 1, borderColor: "gray", borderRadius: 20 }}>
                                <Text style={{ paddingHorizontal: 15, paddingVertical: 5, fontWeight: "bold", fontSize: getFontSize(20) }}>+</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginRight: 10, paddingVertical: 20 }}>
                        </View>
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}
