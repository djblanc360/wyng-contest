/* global */
import AWS from 'aws-sdk'
import asyncHandler from 'express-async-handler'
import fetch from 'node-fetch'

// AWS.config.update({
//     region: 'us-west-2',
//     accessKeyId: process.env.S3_KEY,
//     secretAccessKey: process.env.S3_SECRET
// })
// const s3 = new AWS.S3()
AWS.config.update({ region: 'us-west-2' })
AWS.config.logger = console
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

// @desc: receive related webhooks from wyng with the same local_user_id
// route: GET /webhooks
// @access: Public
const handleGetWebhook = asyncHandler(async (req, res) => {
    console.log('handleGetWebhook incoming stored data: ', req.body)

    const userId = req.body.normalized_submission.local_user_id
    const prefix = `webhooks/${userId}`
    
    const listParams = {
        Bucket: process.env.S3_BUCKET,
        Prefix: prefix
    }

    const listData = await s3.listObjectsV2(listParams).promise()

    const objects = await Promise.all(listData.Contents.map(async (object) => {
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET,
            Key: object.Key
        }
        const data = await s3.getObject(getObjectParams).promise()
        // return JSON.parse(data.Body.toString())

        const parsedData = JSON.parse(Buffer.from(data.Body).toString())
        const message = {
            message: 'successfully retrieved data from S3 bucket',
            data: typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData
        }
        // res.status(200).send(message)
        return message
    }))
    
    console.log('handleGetWebhook objects: ', objects)
    // return objects

    // for testing in POSTMAN
    // res.status(200).json(objects)

    if (req.isAccessedDirectly) {
        res.status(200).json(objects)
    } else {
        return objects
    }
})


// @desc: store webhook from wyng in S3 bucket
// route: POST /webhooks
// @access: Public
const handleStoreWebhook = async (req, res) => {
    const type = req.headers['wyng-submission-type']
    console.log('wyng-submission-type: ', type)

    // test bucket
    s3.listBuckets((err, data) => {
        if (err) {
            console.log("S3 bucket test - Error", err)
        } else {
            console.log("S3 bucket test -", data.Buckets)
        }
    })

    // console.log('handleStoreWebhook incoming payload: ', req.body)
    const data = {
        ...req.body.normalized_submission,
        submission_type: type
    }
    // console.log('handleStoreWebhook incoming data: ', data)
    const userId = data.local_user_id
    // Key: `webhooks/${userId}/${Date.now()}.json`,

    const payload = handleCircularReferences(data)
    console.log('handleStoreWebhook payload: ', payload)

    const buf = Buffer.from(JSON.stringify(payload))
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `webhooks/${userId}/${type}.json`,
        Body: buf,
        ContentType: 'application/json'
    }
    // console.log('handleStoreWebhook params: ', params)
    
    const upload = s3.upload(params).promise()
    .then(data => {
        // console.log('Upload Success', data.Location);
        const status = {
            message: 'successfully stored data in S3 bucket',
            data: data
        }

        // for testing in POSTMAN
        // res.status(200).json(status)
        if (req.isAccessedDirectly) {
            res.status(200).json(status)
        } else {
            return status
        }
    })
    .catch(err => {
        console.log('Error in storing webhook', err)
    })

    console.log('handleStoreWebhook upload: ', upload)
    return upload
}

// @desc: remove selected webhooks from S3 bucket
// route: DELETE /webhooks/:id
// @access: Public
const handleDeleteWebhook = asyncHandler(async (req, res) => {
    console.log('handleDeleteWebhook incoming payload: ', req.body)
    const data = req.body.normalized_submission
    const userId = data.local_user_id
    const prefix = `webhooks/${userId}`
    const params = {
        Bucket: process.env.S3_BUCKET,
        Prefix: prefix
    }
    const listData = await s3.listObjectsV2(params).promise()
    console.log('handleDeleteWebhook listData: ', listData)

    const objects = await Promise.all(listData.Contents.map(async (object) => {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: object.Key
        }
        const data = await s3.deleteObject(params).promise()
        return data
    }))

    console.log('handleDeleteWebhook objects: ', objects)

    const status = {
        message: 'successfully removed data from S3 bucket',
        data: objects
    }

    if (req.isAccessedDirectly) {
        res.status(200).json(status)
    } else {
        return status
    }
})

// backup solution: import safeStringify from 'json-stringify-safe'
// @desc: handle circular references to payload from stringify when testing in POSTMAN
// backup solution: import safeStringify from 'json-stringify-safe'
// @access: Private
const handleCircularReferences = (input, replacer, indent) => {
    const cache = new Set();
    return JSON.stringify(input, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          // Duplicate reference found, discard key
          return
        }
        // Store value in the cache
        cache.add(value)
      }
      return replacer ? replacer(key, value) : value
    }, indent)
}


export { handleGetWebhook, handleStoreWebhook, handleDeleteWebhook }