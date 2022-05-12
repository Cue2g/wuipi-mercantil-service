const Joi = require('@hapi/joi');

exports.schemaPay =
  Joi.object({
    card_number: Joi.string().required(),
    customer_id: Joi.string().required(),
    invoice_number: Joi.string().required(),
    account_type: Joi.string(),
    expiration_date: Joi.string().required(),
    cvv: Joi.string().required(),
    amount: Joi.number().required(),
    browser_agent: Joi.string().required(),
    ipaddress: Joi.string().required(),
    payment_method: Joi.string().required(),
    clave: Joi.string()
  })
