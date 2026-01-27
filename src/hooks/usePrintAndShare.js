import { printToFileAsync } from "expo-print";
import SunmiV2Printer from 'react-native-sunmi-v2-printer';
import { shareAsync } from "expo-sharing";
import Configuration from "../libraries/db/Configuration";

export default function usePrintAndShare() {
  let generatePdf = async (html) => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };

  const printDocument = async (data) => {
    const orderList = []

    data?.products.forEach(p => {
      orderList.push([p?.name])
      // orderList.push([`${p?.qty}`, `$${p?.price}`, `$${p?.price * p?.qty}`])
      orderList.push([`${p?.qty}   ${("               " + '$' + p?.price).slice(-12)}${("               " + '$' + (p?.price * p?.qty)).slice(-12)}`])
    });

    let location = await Configuration.getConfigValue("EMP_DOMICILIO");
    let name = await Configuration.getConfigValue("EMP_NOMBRE");

    if (name == '' || name == undefined || name == null) {
      name = 'SU EMPRESA'
    }

    if (location == '' || location == undefined || location == null) {
      location = 'Su domicilio'
    }

    //ensure the base64 string without URI Scheme
    // let logobase64 = logo.replace('data:image/jpeg;base64,', '');

    // let columnAliment = [0, 1, 2];
    // let columnWidth = [2, 20, 20];
    try {
      //set aligment: 0-left,1-center,2-right
      await SunmiV2Printer.setAlignment(1);

      // await SunmiV2Printer.printBitmap(
      //   logobase64,
      //   384 /*width*/,
      //   380 /*height*/,
      // );
      //SunmiV2Printer.commitPrinterBuffer();

      await SunmiV2Printer.setFontSize(40);
      await SunmiV2Printer.printOriginalText(`${name}\n`);
      // await SunmiV2Printer.printOriginalText('SU EMPRESA\n');
      // await SunmiV2Printer.setFontSize(50);
      // await SunmiV2Printer.printOriginalText('Subtitle name\n');
      await SunmiV2Printer.setFontSize(24);
      await SunmiV2Printer.setAlignment(0);
      await SunmiV2Printer.printOriginalText(`${location}\n`);
      // await SunmiV2Printer.printOriginalText('Su dirección 1234 - Marcos Paz\n');
      // await SunmiV2Printer.printOriginalText(`Buenos Aires, Argentina\n`);
      await SunmiV2Printer.printOriginalText('-------------------------------\n',);
      await SunmiV2Printer.setFontSize(35);
      await SunmiV2Printer.printOriginalText(`PEDIDO\n`);
      // await SunmiV2Printer.printOriginalText(`PEDIDO 00000012\n`);
      await SunmiV2Printer.setAlignment(0);
      await SunmiV2Printer.setFontSize(24);

      await SunmiV2Printer.printOriginalText('-------------------------------\n',);
      await SunmiV2Printer.printOriginalText('-------------------------------\n',);
      // await SunmiV2Printer.setFontSize(24);
      await SunmiV2Printer.printOriginalText(`Fecha: ${data?.order?.date}\n`);
      await SunmiV2Printer.printOriginalText(`Cuenta: ${data?.order?.account} ${data?.accountName}\n`);
      // await SunmiV2Printer.setFontSize(24);

      await SunmiV2Printer.printOriginalText('===============================\n',);
      await SunmiV2Printer.printOriginalText('DETALLE\n',);
      await SunmiV2Printer.printOriginalText('===============================\n',);

      await SunmiV2Printer.setAlignment(0);

      for (var i in orderList) {
        if (i % 2 == 0) {
          await SunmiV2Printer.printOriginalText(`${orderList[i]}\n`);
        } else {
          await SunmiV2Printer.printOriginalText(`${orderList[i]}\n`);


          // await SunmiV2Printer.printColumnsText(
          //   orderList[i],
          //   columnWidth,
          //   columnAliment,
          // );

          await SunmiV2Printer.printOriginalText('-------------------------------\n',);

        }
      }
      // await SunmiV2Printer.setFontSize(24);
      // await SunmiV2Printer.printOriginalText('===============================\n',);
      await SunmiV2Printer.setAlignment(2);
      await SunmiV2Printer.setFontSize(30);
      await SunmiV2Printer.printOriginalText(`Total: $${data?.order?.net}\n`);
      // await SunmiV2Printer.setFontSize(20);
      await SunmiV2Printer.setFontSize(24);


      await SunmiV2Printer.printOriginalText('===============================\n',);
      await SunmiV2Printer.printOriginalText('\n\n');
    } catch (e) {
      console.log(e);
    }
  };

  return { generatePdf, printDocument };
}
