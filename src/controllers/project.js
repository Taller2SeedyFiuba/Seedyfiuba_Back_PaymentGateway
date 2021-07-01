"use strict";

const { ApiError } = require("../errors/ApiError");
const { validateProject } = require("../models/validators");

const { getProject, createProject } = require("../models/project");

exports.post = async (req, res, next) => {
  const { error, value } = validateProject(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const projectInDatabase = await getProject(req.body.projectid);
  if (projectInDatabase) throw ApiError.badRequest("Project already in smart-contract");

  const project = await createProject(req.body);

  res.status(201).json({
    status: "success",
    data: project,
  });
};

exports.get = async (req, res, next) => {
  const projectInDatabase = await getProject(req.params.projectid);
  if (!projectInDatabase) throw ApiError.notFound("Project not found");

  res.status(200).json({
    status: "success",
    data: projectInDatabase,
  });
};

exports.postTransacton = async (req, res, next) => {
  const { error, value } = validateProject(req.body);
  if (error) throw ApiError.badRequest(error.message);

  const projectInDatabase = await getProject(req.body.projectid);
  if (projectInDatabase) throw ApiError.badRequest("Project already in smart-contract");

  const project = await createProject(req.body);

  res.status(201).json({
    status: "success",
    data: project,
  });
};
