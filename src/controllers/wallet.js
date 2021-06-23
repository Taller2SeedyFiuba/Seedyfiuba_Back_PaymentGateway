"use strict";

const { ApiError } = require("../errors/ApiError");
const { validateWallet } = require("../models/validators");

const { createWallet, getWallet, getWalletBalance } = require("../models/wallet");

exports.post = async (req, res, next) => {
  const { error, value } = validateWallet(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const walletInDatabase = await getWallet(req.body.ownerid);
  if (walletInDatabase) throw ApiError.badRequest("User already has a wallet");

  const wallet = await createWallet(req.body);
  delete wallet.privatekey;

  res.status(201).json({
    status: "success",
    data: wallet,
  });
};

exports.get = async (req, res, next) => {
  const wallet = await getWallet(req.params.ownerid);
  if (!wallet) throw ApiError.notFound("Wallet not found");

  delete wallet.privatekey;
  res.status(200).json({
    status: "success",
    data: wallet,
  });
};
