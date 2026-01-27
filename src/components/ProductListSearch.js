import { newOrderStyles } from "@styles/OrderStyle";
import { useState } from "react";
import { FlatList, TextInput, View } from "react-native";

import ProductSearch from "@components/ProductSearch";
import Product from "@db/Product";

export default function ProductListSearch({ handleSelProduct, showAmounts, priceClassSelected = 1, lista = '' }) {
  const [productSearchText, setProductSearchText] = useState("");
  const [productsSearch, setProductsSearch] = useState([]);

  const loadProducts = async (text = "") => {
    setProductSearchText(text);
    if (text == "") {
      setProductsSearch([]);
    } else {
      const data = await Product.findLikeName(text, priceClassSelected, 10, lista);

      // console.log(priceClassSelected)
      setProductsSearch(data);
    }
  };

  const handleRestart = () => {
    setProductSearchText("");
    setProductsSearch([]);
  };

  return (
    <>
      <TextInput
        style={[newOrderStyles.inputSearch]}
        placeholder="Descripción o código del producto"
        onChangeText={(text) => loadProducts(text)}
        keyboardType="default"
        value={productSearchText}
      />

      {productsSearch.length > 0 && (
        <FlatList
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{ height: 400 }}
          scrollEnabled={true}
          style={[newOrderStyles.productSearchList]}
          data={productsSearch}
          keyExtractor={(item) => item.id + ""}
          renderItem={({ item }) => {
            // console.log(item)
            return (
              <ProductSearch
                name={item.name}
                code={item.code}
                price={item.price1}
                functionCall={handleSelProduct}
                showAmount={showAmounts}
                handleRestart={handleRestart}
              ></ProductSearch>
            );
          }}
        />
      )}
    </>
  );
}
