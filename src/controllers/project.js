"use strict";

const { ApiError } = require("../errors/ApiError");
const { validateProject, validateId, validateViewerVote, validateTransaction} = require("../models/validators");

const { getProject, createProject, } = require("../models/project");
const { getWallet } = require("../models/wallet");
const errMsg = require('../errors/messages')
const bch = require("../services/blockchain");

exports.post = async (req, res, next) => {
  const { error } = validateProject(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const ownerWallet = await getWallet(req.body.ownerid);

  const projectInDatabase = await getProject(req.body.projectid);
  if (projectInDatabase) throw ApiError.badRequest(errMsg.PROJECT_ALREADY_IN_SC);

  const smcid = await bch.createProject(
    ownerWallet.address,
    req.body.stages);

  const projectInBlockchain = await bch.getProject(smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError(errMsg.ERROR_CREATING_PROJECT);

  const project = await createProject({
    ownerid: req.body.ownerid,
    projectid: req.body.projectid,
    smcid,
  });

  res.status(201).json({
    status: "success",
    data: {
      ...project,
      ...projectInBlockchain
    },
  });
};

exports.get = async (req, res, next) => {
  const projectInDatabase = await getProject(req.params.projectid);
  if (!projectInDatabase) throw ApiError.notFound(errMsg.PROJECT_NOT_FOUND);

  const projectInBlockchain = await bch.getProject(projectInDatabase.smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError(errMsg.ERROR_GETTING_PROJECT_FROM_BC);

  res.status(200).json({
    status: "success",
    data: {
      ... projectInDatabase,
      ... projectInBlockchain
    },
  });
};

exports.postTransacton = async (req, res, next) => {
  const { error, value } = validateTransaction(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const ownerWallet = await getWallet(req.body.ownerid);
  if (ownerWallet.balance < req.body.amount) throw ApiError.badRequest(errMsg.NO_FOUNDS_IN_WALLET);

  const projectInDatabase = await getProject(req.params.projectid);
  if (!projectInDatabase) throw ApiError.badRequest(errMsg.PROJECT_NOT_IN_SC);

  let projectInBlockchain = await bch.getProject(projectInDatabase.smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError(errMsg.PROJECT_NOT_FOUND_IN_BC);

  if (projectInBlockchain.state != 'funding') throw ApiError.badRequest(errMsg.PROJECT_IN_WRONG_STATE);

  const amount = await bch.transferToProject(projectInDatabase.smcid, ownerWallet.privatekey, req.body.amount);
  projectInBlockchain = await bch.getProject(projectInDatabase.smcid);

  res.status(201).json({
    status: "success",
    data: {
      amount,
      ... projectInDatabase,
      ... projectInBlockchain,
    },
  });
};

exports.postViewer = async (req, res, next) => {
  const { error, value } = validateId(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const ownerWallet = await getWallet(req.body.ownerid);

  const projectInDatabase = await getProject(req.params.projectid);
  if (!projectInDatabase) throw ApiError.badRequest(errMsg.PROJECT_NOT_IN_SC);

  const projectInBlockchain = await bch.getProject(projectInDatabase.smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError(errMsg.PROJECT_NOT_FOUND_IN_BC);

  if (projectInBlockchain.state != 'on_review') throw ApiError.badRequest(errMsg.PROJECT_IN_WRONG_STATE);

  const projectState = await bch.addViwerToProject(projectInDatabase.smcid, ownerWallet.privatekey);

  res.status(201).json({
    status: "success",
    data: {
      ... projectInDatabase,
      ... projectInBlockchain,
      state: projectState
    },
  });
};

exports.postViewerVote = async (req, res, next) => {
  const { error, value } = validateViewerVote(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const ownerWallet = await getWallet(req.params.viewerid);

  const projectInDatabase = await getProject(req.params.projectid);
  if (!projectInDatabase) throw ApiError.badRequest(errMsg.PROJECT_NOT_IN_SC);

  let projectInBlockchain = await bch.getProject(projectInDatabase.smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError(errMsg.PROJECT_NOT_FOUND_IN_BC);

  if (projectInBlockchain.state != 'in_progress') throw ApiError.badRequest(errMsg.PROJECT_IN_WRONG_STATE);

  await bch.voteProjectStage(projectInDatabase.smcid, ownerWallet.privatekey, req.body.completedStage);
  projectInBlockchain = await bch.getProject(projectInDatabase.smcid);

  res.status(201).json({
    status: "success",
    data: {
      ... projectInDatabase,
      ... projectInBlockchain,
    },
  });
};
