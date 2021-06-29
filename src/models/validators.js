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
    projectid: Joi.number().positive(),
    stages: Joi.array().items(Joi.number().positive()),
  }).options({ abortEarly: false });

  return JoiSchema.validate(project);
}

module.exports = { validateWallet, validateProject };
