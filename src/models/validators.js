const Joi = require("joi");

function validateWallet(wallet) {
  const JoiSchema = Joi.object({
    ownerid: Joi.string().max(255).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(wallet);
}

function validateProject(project) {
  const JoiSchema = Joi.object({
    ownerid: Joi.string().max(255).required(),
    projectid: Joi.number().positive().required(),
    stages: Joi.array().items(Joi.number().positive()).min(1).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(project);
}

function validateId(viwer) {
  const JoiSchema = Joi.object({
    ownerid: Joi.string().max(255).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(viwer);
}

function validateTransaction(transaction) {
  const JoiSchema = Joi.object({
    ownerid: Joi.string().max(255).required(),
    amount: Joi.number().positive().required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(transaction);
}

function validateViewerVote(vote) {
  const JoiSchema = Joi.object({
    completedStage: Joi.number().positive().required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(vote);
}

module.exports = { validateWallet, validateProject, validateId, validateViewerVote, validateTransaction };
