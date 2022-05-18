const {
  pay,
  getauth
} = require('../mercantilurls.json');

const {
  getBodyAuth,
  getEncrypt,
  getBodyPayTDD,
  getdecrypt
} = require('../helpers/mercantilHelpers');

const axios = require('axios').default;

const {
  schemaPay
} = require('../helpers/joiconfig')

exports.auth = async (req, res, next) => {
  try {
    const params = req.body
    const {
      error
    } = schemaPay.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      })
    }

    body = getBodyAuth(params),
      headers = {
        'X-IBM-Client-Id': process.env.XIBMClientId,
      }

    const response = await axios.post(getauth, body, {
      headers: headers
    })

    req.getauthdata = response.data
    next()
  } catch (error) {
    const status = error.response.status
    return res.status(status).json({
      error: true,
      response: error.response.data
    })
  }
}


exports.pay = async (req, res) => {
  try {
    const authData = req.getauthdata,
      twofactor_type = authData.authentication_info.twofactor_type,
      typePay = getdecrypt(twofactor_type);

    const cvv = req.body.cvv;
    const clave = req.body.clave
    let cvvEncrypted = null;
    let claveEncrypted = null;

    if (cvv) {
      cvvEncrypted = getEncrypt(cvv);
    }

    if (clave) {
      claveEncrypted = getEncrypt(clave);
    }

    params = req.body;
    params["cvvEncrypted"] = cvvEncrypted;
    params['claveEncrypted'] = claveEncrypted;

    const body = getBodyPayTDD(params);
    const headers = {
      'X-IBM-Client-Id': process.env.XIBMClientId,
    }

    const response = await axios.post(pay, body, {
      headers: headers
    });
    const data = response.data.transaction_response
    const registerWuipi = registerPay(data.invoice_number, data.payment_reference);

    if (registerWuipi.error === true) {
      throw new Error(registerWuipi.response)
    }

    res.status(200).json({
      trx_status: data.trx_status,
      bankResponse: {
        processing_date: data.processing_date,
        trx_status: data.trx_status,
        payment_reference: data.payment_reference,
        amount: data.amount
      },
      registerResponse: registerWuipi
    })
  } catch (error) {
    const status = error.response.status
    return res.status(status).json({
      error: true,
      response: error.response.data
    })
  }
}

///wuipiRegister
async function registerPay(idFactura, idTransaccion) {
  const body = {
    "token": process.env.tokenWuipi,
    'idfactura': idFactura,
    'pasarela': 'Mercantil',
    'idtransaccion': idTransaccion
  }

  try {
    
    const response = await axios.post('https://gestion.wuipi.net/api/v1/PaidInvoice', body);
    return {
      response,
      error: false
    }

  } catch (e) {
    return {
      response: e,
      error: true
    }
  }
}
