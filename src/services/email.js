import { setDataToApi } from "../libraries/api";

export const sendEmailWithAPI = async (payment_id, to, account, method, amount, seller) => {
  const payload = {
    to: to,
    account: account,
    mp: method,
    payment_id: payment_id,
    amount: amount,
    seller: seller,
  };

  const response = await setDataToApi("utils/sendemail_payment", JSON.stringify(payload));
};
