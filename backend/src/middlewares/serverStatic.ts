import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    const resolvedBase = path.resolve(baseDir)

    return (req: Request, res: Response, next: NextFunction) => {
        const filePath = path.resolve(resolvedBase, '.' + req.path)

        if (
            filePath !== resolvedBase &&
            !filePath.startsWith(resolvedBase + path.sep)
        ) {
            return next()
        }

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return next()
            }
            return res.sendFile(filePath, (err) => {
                if (err) {
                    next(err)
                }
            })
        })
    }
}
