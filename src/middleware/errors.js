// a catch-all for routes that don't exist
const notFound = (req, res, next) => {
    // return res.status(404).json({
    //     error: 'Not Found',
    // })
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

// a catch-all for invalid form errors
const validationErrors = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Something went wrong.'
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = err.errors
    }
    res.status(statusCode)
    res.json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // err.stack will show line number
    })
    next(err)
}

// for invalid domain, check against domainCredentials

/*import { domainCredentials } from '../credentials.js'

const invalidDomain = (err, req, res, next) => {
    const domain = req.body.domain

    let statusCode = err.statusCode || 500
    let message = err.message || 'Something went wrong in checking domain'
    
    if (!domain) {
        message = 'error.js - Missing domain'
    }

    if (!domainCredentials[domain]) {
        message = 'error.js - Invalid domain'
    }

    res.status(statusCode)
    res.json({
        message: message,
        stack: err.stack // err.stack will show line number
    })
}
*/

export { notFound, validationErrors }