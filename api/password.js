const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const encryptPassword = async (plaintext) => {
  const schema = Joi.string().min(8).max(100).required();
  const { error } = schema.validate(plaintext);

  if (!error) {
    const password = await bcrypt.hash(plaintext, saltRounds);

    return password;
  } else {
    throw new Error(error);
  }
};

const validatePassword = async (entered, encrypted) => {
  const schema = Joi.object().keys({
    entered: Joi.string().min(8).max(100).required(),
    encrypted: Joi.string().min(8).max(100).required(),
  });
  const { error } = schema.validate({ entered, encrypted });

  if (!error) {
    const result = await bcrypt.compare(entered, encrypted);

    if (result) {
      return true;
    } else {
      return false;
    }
  } else {
    throw new Error(error);
  }
};

module.exports = { encryptPassword, validatePassword };
