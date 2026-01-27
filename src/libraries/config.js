import { getFromDB, insertInDB } from "./sqlite";

export const getKey = async (key) => {
  const data = await getFromDB("config", 1, `key='${key}'`);

  if (data.length > 0) {
    return data[0].value;
  } else {
    return "";
  }
};

export const setKey = async (key, value) => {
  let values = [];
  values.push(null);
  values.push(`${key}`);
  values.push(`${value}`);

  await insertInDB("config", "(?,?,?)", values, false)
    .then((r) => {})
    .catch((e) => {
      console.log("Error al grabar la configuración: " + e);
    });
};
