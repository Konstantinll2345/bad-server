import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS, ORIGIN_ALLOW } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.use(helmet())
app.use(cookieParser())

const corsOptions = { origin: ORIGIN_ALLOW, credentials: true }
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(
    rateLimit({
        windowMs: 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    })
)

app.use((req, res, next) => {
    const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
    if (unsafeMethods.includes(req.method)) {
        const origin = req.get('Origin')
        const referer = req.get('Referer')
        const originOk = origin === ORIGIN_ALLOW
        const refererOk = Boolean(referer && referer.startsWith(ORIGIN_ALLOW))
        if (!originOk && !refererOk) {
            return res
                .status(403)
                .json({ message: 'CSRF: недопустимый источник запроса' })
        }
    }
    return next()
})

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '1mb' }))
app.use(json({ limit: '1mb' }))

app.use(routes)
app.use(errors())
app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()