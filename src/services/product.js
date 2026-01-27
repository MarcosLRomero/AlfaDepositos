import { getDataFromAPI } from "../libraries/api";

export const getProductStock = async (productId) => {
  const payload = {
    code: productId,
  };

  const data = await getDataFromAPI("stock/product", JSON.stringify(payload), "POST");
  if (data.status_code === 200) {
    return data;
  } else {
    return { status_code: 400, message: data.message };
  }
};

export const getAvailableStockProducts = async (productId) => {
  return 999999999999;
  //TODO ver si este proceso esta tardando
  let availableStock = 0;

  try {
    const data = await getProductStock(productId);

    let existsSugerido = false;
    let stockSugerido = 0;
    let stockReal = 0;

    if (data.status_code === 200) {
      if (data.data.length > 0) {
        data.data.forEach((item) => {
          if (item.deposito == "@SUGERIDO") {
            stockSugerido = item.stock;
            existsSugerido = true;
          }
          if (item.deposito == "@REAL") {
            stockReal = item.stock;
          }
        });
      }

      availableStock = stockSugerido;

      //Si no tengo sugerido, puede ser que no lo este retornando la API
      //Por eso verifico si lo lei, si no lo lei, tomo el stock real
      if (!existsSugerido) {
        availableStock = stockReal;
      }
    } else {
      //Hubo error de api
      availableStock = 9999999;
    }
  } catch {
    //Hubo error
    availableStock = 9999999;
  }

  return availableStock;
};
