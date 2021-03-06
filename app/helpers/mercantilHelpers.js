
const {crypto} = require('./crypto')
const clave = process.env.MCLAVECIFRADO;
const hashKey = crypto.hashKEY(clave,'binary');
const binaryHK_16 = hashKey.slice(0, 16);

exports.getEncrypt = (val) => {
  const encryptcvv = crypto.encrypt(binaryHK_16,'binary', '',val);
  return encryptcvv;
}

exports.getdecrypt = (val) => {
  const descrypt = crypto.decrypt(binaryHK_16,'binary', '', val)
  return descrypt
}

exports.getBodyAuth = (params) => {

  const data = {
    "merchant_identify": {
      "integratorId": 1,
      "merchantId": process.env.MechantID,
      "terminalId": "1"
    },
    "client_identify": {
      "ipaddress": params.ipaddress,
      "browser_agent": params.browser_agent
    },
    "transaction_authInfo": {
      "trx_type": "solaut",
      "payment_method": params.payment_method,
      "card_number": params.card_number,
      "customer_id": params.customer_id
    }
  }

  return data
}

exports.getBodyPayTDD = (params) => {
  const data = {
    "merchant_identify": {
      "integratorId": 1,
      "merchantId": process.env.MechantID,
      "terminalId": "1"
    },
    "client_identify": {
      "ipaddress": params.ipaddress,
      "browser_agent": params.browser_agent,
    },
    "transaction": {
      "trx_type": "compra",
      "payment_method": "tdd",
      "card_number": params.card_number,
      "customer_id": params.customer_id,
      "invoice_number": params.invoice_number,
      "account_type": params.account_type,
      "twofactor_auth": params.claveEncrypted,
      "expiration_date": params.expiration_date,
      "cvv": params.cvvEncrypted,
      "currency": "ves",
      "amount": params.amount
    }
  }
  return data
}
