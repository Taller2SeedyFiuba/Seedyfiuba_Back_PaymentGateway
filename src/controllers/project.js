"use strict";

const { ApiError } = require("../errors/ApiError");
const { validateProject, validateId, validateViewerVote, validateTransaction} = require("../models/validators");

const { getProject, createProject } = require("../models/project");
const { getWallet } = require("../models/wallet");
const bch = require("../services/blockchain");

exports.post = async (req, res, next) => {
  const { error } = validateProject(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const ownerWallet = await getWallet(req.body.ownerid);

  const projectInDatabase = await getProject(req.body.projectid);
  if (projectInDatabase) throw ApiError.badRequest("Project already in smart-contract");

  const smcid = await bch.createProject(
    ownerWallet.address,
    req.body.stages);

  const projectInBlockchain = await bch.getProject(smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError("Error creating project");

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
  if (!projectInDatabase) throw ApiError.notFound("Project not found");

  const projectInBlockchain = await bch.getProject(projectInDatabase.smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError("Error getting project from blockchain");

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
  if (ownerWallet.balance < req.body.amount) throw ApiError.badRequest("Not enough funds in wallet");

  const projectInDatabase = await getProject(req.params.projectid);
  if (!projectInDatabase) throw ApiError.badRequest("Project not in smart-contract");

  let projectInBlockchain = await bch.getProject(projectInDatabase.smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError("Project not found in blockchain");

  if (projectInBlockchain.state != 'funding') throw ApiError.badRequest("Project not in correct state");

  await bch.transferToProject(projectInDatabase.smcid, ownerWallet.privatekey, req.body.amount);
  projectInBlockchain = await bch.getProject(projectInDatabase.smcid);

  res.status(201).json({
    status: "success",
    data: {
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
  if (!projectInDatabase) throw ApiError.badRequest("Project not in smart-contract");

  const projectInBlockchain = await bch.getProject(projectInDatabase.smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError("Project not found in blockchain");

  if (projectInBlockchain.state != 'on_review') throw ApiError.badRequest("Project not in correct state");

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
  if (!projectInDatabase) throw ApiError.badRequest("Project not in smart-contract");

  let projectInBlockchain = await bch.getProject(projectInDatabase.smcid);
  if (!projectInBlockchain) throw ApiError.externalServiceError("Project not found in blockchain");

  if (projectInBlockchain.state != 'in_progress') throw ApiError.badRequest("Project not in correct state");

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
