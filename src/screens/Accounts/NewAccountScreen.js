import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { useEffect, useState, useContext } from 'react'
import Colors from "@styles/Colors";
import { bulkInsert } from "@db/Functions";
import { Picker } from '@react-native-picker/picker';
import { UserContext } from "@context/UserContext";

const condsIva = [
    {
        code: '1',
        name: 'Responsable Inscripto'
    },
    {
        code: '2',
        name: 'Responsable No Inscripto'
    },
    {
        code: '3',
        name: 'Consumidor Final'
    },
    {
        code: '4',
        name: 'IVA Exento'
    },
    {
        code: '5',
        name: 'Monotributo'
    },
    {
        code: '6',
        name: 'Sujeto No Categorizado'
    },
    {
        code: '8',
        name: 'No Responsable'
    }
]

// const docsType = [
//     {
//         code: '1',
//         name: 'CUIT'
//     },
//     {
//         code: '2',
//         name: 'CUIL'
//     },
//     {
//         code: '3',
//         name: 'DNI'
//     },
// ]

export default function NewAccountScreen() {

    const [login, loginAction] = useContext(UserContext);

    const [data, setData] = useState({
        name: '',
        location: '',
        phone: '',
        address: '',
        number: '',
        email: '',
        cuit: '',
        iva: '',
    })

    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState({
        status: '',
        message: ''
    })


    useEffect(() => {

    }, [])

    const handleSave = async () => {

        setResponse({
            status: '',
            message: ``
        })

        if (data.name == '' || data.cuit == '') {
            setResponse({
                status: 'error',
                message: `Debe informar el nombre y el cuit`
            })
            return;
        }

        setIsLoading(true)

        try {

            const code = Math.floor(Math.random() * 100);
            const props = {
                code: `${code}`,
                name: data.name,
                address: data.address,
                location: data.location,
                cuit: data.cuit,
                iva: data.iva,
                price_class: "1",
                phone: data.phone,
                mail: data.email,
                id_seller: login.user.user,
                tc_default: "NEW"
            };

            bulkInsert("accounts", [props]);

            setResponse({
                status: 'ok',
                message: `Creado correctamente`
            })

            setData({})
        } catch (e) {
            console.log(e)
            setResponse({
                status: 'error',
                message: `${e}`
            })
        }

        setIsLoading(false)

    }

    return (
        <ScrollView style={styles.mainContainer}>
            <View style={styles.container}>

                <Text style={styles.title}></Text>

                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    value={data.name}
                    onChangeText={(text) => setData({ ...data, name: text })}
                    placeholder="Nombre"
                />

                <Text style={styles.label}>Cond. IVA</Text>
                <View style={styles.containerLocation}>
                    <Picker
                        style={styles.selectLocation}
                        selectedValue={data.iva}
                        onValueChange={(itemValue, itemIndex) =>
                            setData({ ...data, iva: itemValue })
                        }>
                        {condsIva.map((condition, idx) => (

                            <Picker.Item key={idx} label={condition.name} value={condition.code} />
                        ))}
                    </Picker>
                </View>


                <Text style={styles.label}>CUIT</Text>
                <TextInput
                    style={styles.input}
                    value={data.cuit}
                    onChangeText={(text) => setData({ ...data, cuit: text })}
                    placeholder="CUIT"
                />

                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                    style={styles.input}
                    value={data.phone}
                    onChangeText={(text) => setData({ ...data, phone: text })}
                    placeholder="Telefono"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={data.email}
                    onChangeText={(text) => setData({ ...data, email: text })}
                    placeholder="Telefono"
                />

                <Text style={styles.label}>Dirección</Text>
                <TextInput
                    style={styles.input}
                    value={data.address}
                    onChangeText={(text) => setData({ ...data, address: text })}
                    placeholder="Dirección"
                />

                <Text style={styles.label}>Localidad</Text>
                <TextInput
                    style={styles.input}
                    value={data.location}
                    onChangeText={(text) => setData({ ...data, location: text })}
                    placeholder="Localidad"
                />


                {isLoading && <ActivityIndicator size="large" color={Colors.GREEN} />}
                {response.status && <Text style={[styles.message, response.status == 'error' ? styles.error : styles.ok]} >{response.message}</Text>}

                <TouchableOpacity
                    onPress={handleSave}
                    style={styles.btnNewAccount}
                >
                    <Text style={styles.textBtnNewAccount}>Crear cliente</Text>
                </TouchableOpacity>

            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        marginBottom: 50
    },
    container: {
        marginTop: 0
    },
    title: {
        textAlign: "center",
        fontSize: 20,
        // marginVertical: 5,
    },
    input: {
        marginHorizontal: 20,
        backgroundColor: "#ffffff",
        paddingVertical: 5,
        paddingHorizontal: 10,
        // borderRadius: 10,
        marginBottom: 20,
        fontSize: 16
    },
    label: {
        marginHorizontal: 20,
        fontSize: 16
    },
    btnNewAccount: {
        textAlign: "center",
        padding: 10,
        backgroundColor: Colors.DGREEN,
        marginBottom: 10,
        // borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 10
    },
    textBtnNewAccount: {
        textAlign: "center",
        fontSize: 17,
        color: Colors.WHITE,
    },
    error: {
        color: Colors.RED
    },
    ok: {
        color: Colors.GREEN
    },
    message: {
        textAlign: "center",
        fontSize: 16,
        marginVertical: 10
    },
    containerLocation: {
        marginHorizontal: 20,
        // borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        overflow: 'hidden',
        marginTop: 10,
        backgroundColor: "#ffffff",
        marginBottom: 10
    },
    selectLocation: {
        // borderWidth: 1,
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        // marginBottom: 0,
        // borderRadius: 10,
    },
})