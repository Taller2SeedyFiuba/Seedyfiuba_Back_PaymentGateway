const Joi = require("joi");

function validateWallet(user) {
  const JoiSchema = Joi.object({
    ownerid: Joi.string().max(255).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(user);
}

module.exports = { validateWallet };
