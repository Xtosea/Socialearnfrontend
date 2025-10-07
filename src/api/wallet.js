import api from "./api";

export const getWallet = async () => {
  const res = await api.get("/wallet");
  return res.data;
};

export const redeemPoints = async (amount) => {
  const res = await api.post("/wallet/redeem", { amount });
  return res.data;
};

export const transferPoints = async (recipient, amount) => {
  const res = await api.post("/wallet/transfer", { recipient, amount });
  return res.data;
};