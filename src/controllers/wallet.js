"use strict";

const { ApiError } = require("../errors/ApiError");
const { validateWallet } = require("../models/validators");

const { createWallet, getWallet } = require("../models/wallet");

exports.post = async (req, res, next) => {
  const { error, value } = validateWallet(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const wallet = await createWallet(req.body);
  delete wallet.privatekey;

  res.status(201).json({
    status: "success",
    data: wallet,
  });
};

exports.get = async (req, res, next) => {
  const wallet = await getWallet(req.params.ownerid);

  delete wallet.privatekey;
  res.status(200).json({
    status: "success",
    data: wallet,
  });
};
