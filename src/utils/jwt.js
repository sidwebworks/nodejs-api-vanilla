import jsonwebtoken from 'jsonwebtoken'
import { promisify } from 'util'

const {
  sign,
  verify: _verify,
  NotBeforeError,
  TokenExpiredError,
} = jsonwebtoken

const verify = promisify(_verify)

export function createToken(payload, secret, config = {}) {
  return sign(payload, secret, {
    audience: 'cool-domain.com',
    expiresIn: '20d',
    ...config,
  })
}

export async function verifyToken(token, secret) {
  try {
    const payload = await verify(token, secret)

    return {
      payload,
      valid: true,
      expired: false,
    }
  } catch (error) {
    if (error instanceof NotBeforeError) {
      return {
        expired: false,
        valid: true,
        payload: null,
        message: `Token cannot be used before ${error.date.toUTCString()}`,
      }
    }

    if (error instanceof TokenExpiredError) {
      return {
        expired: true,
        valid: false,
        payload: null,
        message: `Token expired`,
      }
    }

    return {
      valid: false,
      expired: false,
      payload: null,
      message: `Invalid token`,
    }
  }
}
