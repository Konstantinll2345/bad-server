import { doubleCsrf } from 'csrf-csrf'
import { Request } from 'express'
import { CSRF_SECRET } from '../config'

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  cookieName: '__csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
    path: '/',
  },

  getSessionIdentifier: (req: Request) => {
    return req.ip || 'anonymous'
  },
  getCsrfTokenFromRequest: (req: Request) =>
    req.headers['x-csrf-token'] as string,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
})

export { doubleCsrfProtection, generateCsrfToken as generateToken }
