import { useCart } from '@hooks/useCart';
import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { currencyFormat } from '../../libraries/utils';
import { getFontSize } from "../../utils/Metrics";
import ModalItem from './ModalItem';
import ProductImage from '../ProductImage';


export default function ItemResumeCart({ item }) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [priceClassSelected, setPriceClassSelected] = useState(null)

    const { addToCart, noPermiteDuplicarItem, loadImages, decreaseQuantity, removeFromCart, getCurrentQuantity, globalPriceClass } = useCart();

    useEffect(() => {
        const priceToShow = `price${globalPriceClass}`;
        setPriceClassSelected(priceToShow)
    }, [globalPriceClass])

    // console.log(item)

    return (
        <TouchableOpacity style={{ width: "100%", paddingHorizontal: 1, backgroundColor: "white" }} onPress={() => setIsModalVisible(true)} >

            <View style={{ backgroundColor: "white", display: "flex", flexDirection: "row", width: "100%" }}>
                <ModalItem isVisible={isModalVisible} setIsVisible={setIsModalVisible} item={item} />

                {loadImages &&
                    <View style={{ flex: 0, alignItems: "center", justifyContent: "flex-start", marginRight: 4 }}>
                        {/* <Image source={imgProduct}></Image> */}
                        <ProductImage widthImage={60} heightImage={60} fileName={item.code} />
                    </View>
                }
                <View style={{ flex: 3, paddingVertical: 3, borderBottomColor: "gray", borderBottomWidth: 1 }}>
                    <Text style={{ fontSize: getFontSize(12) }}>#{item?.code}</Text>
                    {parseInt(item?.disc) > 0 && <Text style={{ fontSize: getFontSize(12) }}>DESCUENTO : {item?.disc}%</Text>}
                    <Text style={{ fontSize: getFontSize(14) }}>{item?.name}</Text>
                    {item?.disc > 0 ?
                        <Text style={{ fontSize: getFontSize(16), fontWeight: "600" }}>{currencyFormat(item?.quantity * item?.priceWithDiscount)} ({item?.quantity} x {currencyFormat(item?.priceWithDiscount)}) <Text style={{ textDecorationLine: "line-through" }}>{currencyFormat(item?.[priceClassSelected])}</Text></Text>
                        :
                        <Text style={{ fontSize: getFontSize(16), fontWeight: "600" }}>{currencyFormat(item?.quantity * item?.[priceClassSelected])} ({item?.quantity} x {currencyFormat(item?.[priceClassSelected])}) </Text>
                    }
                    {item?.bultos > 0 && <Text style={{ fontSize: getFontSize(14) }}>{item?.bultos} Bultos</Text>}

                    <View style={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => removeFromCart(item.code)} style={{ backgroundColor: "red", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5 }}>
                            <Text style={{ fontSize: getFontSize(14), color: "white" }}>Eliminar</Text>
                        </TouchableOpacity>

                        {!noPermiteDuplicarItem ?
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", }}>
                                <TouchableOpacity onPress={() => decreaseQuantity(item.code)} style={{ borderWidth: 1, borderColor: "gray", borderRadius: 20 }}>
                                    <Text style={{ paddingHorizontal: 15, fontWeight: "bold", paddingVertical: 5, fontSize: getFontSize(20), fontWeight: "500" }}>-</Text>
                                </TouchableOpacity>

                                <Text style={{ fontSize: getFontSize(18), fontWeight: "bold", paddingHorizontal: 10, textAlign: "center", minWidth: 60 }}>{getCurrentQuantity(item.code)}</Text>

                                <TouchableOpacity onPress={() => {
                                    addToCart(item)
                                }} style={{ borderWidth: 1, borderColor: "gray", borderRadius: 20 }}>
                                    <Text style={{ paddingHorizontal: 15, paddingVertical: 5, fontWeight: "bold", fontSize: getFontSize(20), fontWeight: "500" }}>+</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingVertical: 20 }}>
                            </View>
                        }
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}