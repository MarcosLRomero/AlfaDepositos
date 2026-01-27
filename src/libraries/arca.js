import Order from "@db/Order";
import Account from "@db/Account";
import OrderDetail from "@db/OrderDetail"
import Product from "./db/Product";
import { setDataToApi } from "@libraries/api";

export const generarComprobanteElectronico = async (tipoDocumento, orderId) => {

    const order = await Order.find(orderId);
    const items = await OrderDetail.findByIdOrder(orderId)
    const account = await Account.findBy({ code_eq: order.account });
    const products = []
    const tc = tipoDocumento == 'eFC' ? 'FC' : (tipoDocumento == 'eNC' ? 'NC' : 'ND')

    for await (const item of items) {
        // console.log(item)
        const product = await Product.findBy({ code_eq: item.product })

        const pUnitario = item.unitary
        const alicIva = (product.iva == 0 || product?.iva == null || product.iva == undefined) ? 21 : parseFloat(product.iva)
        const alicuotaIva = (alicIva / 100) + 1
        const neto = pUnitario / alicuotaIva
        const iva = pUnitario - neto

        // console.log(order)

        products.push({
            alicIva: alicIva,
            code: product.code,
            discount: 0,
            exempt: product.exempt,
            iva: iva,
            name: product.name,
            neto: neto,
            price: pUnitario,
            quantity: item.qty
        })
    }

    const payload = {
        account: order.account,
        date: `${order.date.substring(6, 10)}-${order.date.substring(3, 5)}-${order.date.substring(0, 2)}`,
        seller: order.id_seller,
        products: products,
        observations: order.obs,
        name: account ? account.name : "",
        phone: "",
        email: "",
        tc: tc,
        branch: null,
        account_document: "",
        account_document_type: "",
    };

    const response = await setDataToApi("sales/receipt", JSON.stringify(payload));

    if (response.error) {
        //ELIMINO EL COMPROBANTE
        await Order.destroy(orderId);
        await OrderDetail.deleteItemsByOrderId(orderId);

        return response
    }

    // console.log(response?.data[0]?.print_data)
    // console.log("SIGUIO")

    //GENERO EL CPTE CORRECTAMENTE
    const props = {
        id: order.id,
        ecpte: response.data[0].number,
        delivery: 1,
        cae: response.data[0].cae,
        vto_cae: response.data[0].vto_cae.substring(6, 8) + '/' + response.data[0].vto_cae.substring(4, 6) + '/' + response.data[0].vto_cae.substring(0, 4)
    }

    //ACTUALIZO LA BASE
    await Order.update(props)

    return response
}