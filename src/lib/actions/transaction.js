"use server";

import { serverMutation } from "../core/server";

export const createTransaction = async (txData) => {
  return serverMutation("/api/transactions", txData);
};
