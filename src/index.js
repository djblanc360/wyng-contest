import express from 'express'
import cors from 'cors'
import AWS from 'aws-sdk'
import bodyParser from 'body-parser'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


// AWS.config.update({
//     region: 'us-west-2',
//     accessKeyId: process.env.S3_KEY,
//     secretAccessKey: process.env.S3_SECRET
// })

// const s3 = new AWS.S3()
// global.s3 = s3

import { setGlobalVars } from './credentials.js'

import { notFound, validationErrors } from './middleware/errors.js'
// import { accessedDirectly } from './middleware/access.js'
import contentRoutes from './routes/content.js'
import contestRoutes from './routes/contest.js'
import storeRoutes from './routes/store.js'

app.use(setGlobalVars)

app.use('/content', contentRoutes)
app.use('/contest', contestRoutes)
app.use('/store', storeRoutes)
// app.get("/", (req, res, next) => {
//   return res.status(200).json({
//     message: "Hello from root!",
//   });
// });

app.use(notFound)
app.use(validationErrors)

// app.use(invalidDomain)


export default app
