import { View, Text, Modal, Alert, TouchableOpacity, TextInput, Inpu } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getFontSize } from '../../utils/Metrics'
import { useCart } from '../../hooks/useCart';
import Configuration from "@db/Configuration";
import Colors from '../../styles/Colors';

export default function ModalItem({ isVisible, setIsVisible, item, isNew = false }) {
    const [quantity, setQuantity] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [bultos, setBultos] = useState(0)
    const [price, setPrice] = useState(0)
    const [config, setConfig] = useState({
        showStock: "",
        descPorArticulo: "",
        bloqueaStockRealNegativo: "",
        bloqueaStockComprometidoNegativo: "",
        pideBultos: "",
        pidePrecio: ""
    })

    const { addToCart, account, getItem, removeFromCart } = useCart();

    const { code, name } = item || { code: '', name: '' }

    const loadConfig = async () => {
        let newConfig = {}

        let data = await Configuration.getConfig("DESCUENTO_POR_ARTICULO");
        newConfig.descPorArticulo = data[0].value;

        data = await Configuration.getConfig("CONSULTA_STOCK_PEDIDOS");
        newConfig.showStock = data[0].value;

        // data = await Configuration.getConfig("BLOQUEA_STK_REAL_NEGATIVO");
        // newConfig.bloqueaStockRealNegativo = data[0].value;

        // data = await Configuration.getConfig("BLOQUEA_STK_COMPROMETIDO_NEGATIVO");
        // newConfig.bloqueaStockComprometidoNegativo = data[0].value;

        data = await Configuration.getConfig("PIDE_BULTOS");
        newConfig.pideBultos = data[0].value;

        data = await Configuration.getConfig("PIDE_PRECIO");
        newConfig.pidePrecio = data[0].value;

        setConfig(newConfig)
    };

    // const quantity = getCurrentQuantity(code) || 0
    useEffect(() => {
        if (isVisible) {
            // console.log(item)
            if (item) {
                setPrice(item[`price${account?.priceClass}`] + "")
                setQuantity(item['cant_propuesta'] + "")
            }

            loadConfig()
            const pItem = getItem(code)

            if (pItem && !isNew) {
                setQuantity(pItem?.quantity == 0 ? "1" : pItem?.quantity + "")

                if (pItem?.disc > 0) {
                    setDiscount(pItem.disc + "")
                }
                setBultos(pItem?.bultos + "")

                //TODO chequear esto
                setPrice(pItem[`price${account?.priceClass}`] + "")
            }
        }
    }, [isVisible])


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <View style={{ elevation: 5, margin: 20, width: "90%", padding: 20, backgroundColor: "white", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>

                <Text style={{ fontSize: getFontSize(15), fontWeight: "500" }}>{code}</Text>
                <Text style={{ fontSize: getFontSize(15), fontWeight: "500" }}>{name}</Text>

                <View style={{ marginTop: 20, width: "100%" }}>

                    <Text style={{ fontSize: getFontSize(18), marginBottom: 5 }}>Ingrese la cantidad</Text>

                    <TextInput

                        autoFocus={isVisible}
                        // ref={inputRef}
                        style={{ width: "100%", borderColor: "gray", fontSize: getFontSize(18), borderWidth: 1, paddingHorizontal: 5, paddingVertical: 5 }}
                        onChangeText={(text) => setQuantity(text)}
                        keyboardType="number-pad"
                        value={quantity}
                    // defaultValue={quantity}
                    // editable={!isLoading}
                    />
                    <Text style={{ fontSize: getFontSize(13) }}>Si no se informa se toma 1</Text>
                </View>

                {(config.pideBultos == "1" || config.pideBultos == 1) && (
                    <View style={{ marginTop: 20, width: "100%" }}>
                        <Text style={{ fontSize: getFontSize(18), marginBottom: 5 }}>Ingrese los bultos</Text>

                        <TextInput
                            // autoFocus={modalVisible}
                            // ref={inputRef}
                            value={bultos}
                            style={{ width: "100%", borderColor: "gray", fontSize: getFontSize(18), borderWidth: 1, paddingHorizontal: 5, paddingVertical: 5 }}
                            onChangeText={(text) => setBultos(text)}
                            keyboardType="number-pad"
                        // editable={!isLoading}
                        />
                    </View>
                )}

                {(config.pidePrecio == "1" || config.pidePrecio == 1) && (
                    <View style={{ marginTop: 20, width: "100%" }}>
                        <Text style={{ fontSize: getFontSize(18), marginBottom: 5 }}>Ingrese el precio</Text>

                        <TextInput
                            // autoFocus={modalVisible}
                            // ref={inputRef}
                            value={price}
                            // defaultValue={price}
                            style={{ width: "100%", borderColor: "gray", fontSize: getFontSize(18), borderWidth: 1, paddingHorizontal: 5, paddingVertical: 5 }}
                            onChangeText={(text) => setPrice(text)}
                            keyboardType="number-pad"
                        // editable={!isLoading}
                        />
                    </View>
                )}

                {(config.descPorArticulo == "1" || config.descPorArticulo == 1) && (
                    <View style={{ marginTop: 20, width: "100%" }}>
                        <Text style={{ fontSize: getFontSize(18), marginBottom: 5 }}>Descuento</Text>
                        <TextInput
                            value={discount}
                            style={{ width: "100%", borderColor: "gray", fontSize: getFontSize(18), borderWidth: 1, paddingHorizontal: 5, paddingVertical: 5 }}
                            onChangeText={(text) => setDiscount(text)}
                            keyboardType="number-pad"
                        // editable={!isLoading}
                        />
                    </View>
                )}

                <View style={{ marginTop: 20, width: "100%" }}>
                    <TouchableOpacity style={{ width: "100%", backgroundColor: Colors.GREEN, paddingVertical: 10 }} onPress={() => {
                        if (!isNew) {
                            removeFromCart(item.code)
                        }
                        addToCart(item, quantity == 0 ? 1 : quantity, discount, bultos, price, !isNew)
                        setIsVisible(false)
                    }}>
                        <Text style={{ textAlign: "center", fontSize: getFontSize(15), fontWeight: "500" }}>AGREGAR A CARRITO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: "100%", marginTop: 20, backgroundColor: Colors.RED, paddingVertical: 10 }} onPress={() => setIsVisible(false)}>
                        <Text style={{ textAlign: "center", fontSize: getFontSize(15), fontWeight: "500" }}>CANCELAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}