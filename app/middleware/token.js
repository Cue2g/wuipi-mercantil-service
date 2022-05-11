const jwt = require('jsonwebtoken')

exports.verification = function verification(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ').pop(),
      verify = jwt.verify(token, process.env.SECRET);
    if (verify.auth) {
      next()
    }
  } catch (e) {
    return res.status(401).json({
      error: true,
      message: 'Auth Unauthorized'
    })
  }
}
