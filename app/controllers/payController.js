const {
  pay,
  getauth
} = require('../mercantilurls.json');

const {
  getBodyAuth,
  getEncrypt,
  getBodyPayTDD
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

  console.log(body)
  await axios.post(getauth, body, {
      headers: headers
    })
    .then(async (resp) => {
      req.getauthdata = await resp.data
      next()
    })
    .catch((error) => {
      const status = error.response.status
      console.log(error)
      return res.status(status).json({
        code: error.code,
        message: error.message
      })
    })

}

exports.pay = async (req, res, next) => {
  const authData = req.getauthdata,
    twofactor_type = authData.authentication_info.twofactor_type,
    cvvEncrypted = getEncrypt(req.cvv),
    params = req.body;
  params["twofactor_type"] = twofactor_type,
    params['cvvEncrypted'] = cvvEncrypted
  console.log(twofactor_type)
  const body = getBodyPayTDD(params)
  console.log(body)
}
