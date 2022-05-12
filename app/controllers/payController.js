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

    // next()

  await axios.post(getauth, body, {
      headers: headers
    })
    .then(async (response) => {
      req.getauthdata = await response.data
      next()
    })
    .catch((error) => {
      const status = error.response.status;
      const data = error.response.data;
      return res.status(status).json({
        code_bank: data.error_list[0].error_code ,
        description: data.error_list[0].description,
        processing_date: data.processing_date
      })
    })

}

exports.pay = async (req, res) => {
  const authData = req.getauthdata,
    twofactor_type = authData.authentication_info.twofactor_type,
    typePay = getdecrypt(twofactor_type);
    const cvv = req.body.cvv;
    const clave = req.body.clave
    let cvvEncrypted = null;
    let claveEncrypted = null;
    if(cvv){
      cvvEncrypted = getEncrypt(cvv);
    }

    // console.log(typePay)
    if(clave){
      claveEncrypted = getEncrypt(clave);
    }

    params = req.body;
    params["cvvEncrypted"] = cvvEncrypted;
    params['claveEncrypted'] = claveEncrypted;

  const body = getBodyPayTDD(params);
  const headers = {
    'X-IBM-Client-Id': process.env.XIBMClientId,
  }

  // return console.log(body)
  await axios.post(pay, body, {
      headers: headers
    })
    .then(async (resp) => {
      const data = resp.data.transaction_response
      res.status(200).json({
        processing_date:data.processing_date,
        trx_status:data.trx_status,
        payment_reference:data.payment_reference,
        amount:data.amount
      })
    })
    .catch((error) => {
      const status = error.response.status;
      const data = error.response.data;
      return res.status(status).json({
        code_bank: data.error_list[0].error_code ,
        description: data.error_list[0].description,
        processing_date: data.processing_date
      })
    })
}
