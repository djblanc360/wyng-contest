/* global credentials */

import asyncHandler from 'express-async-handler'
import fetch from 'node-fetch'

import { handleGetWebhook, handleStoreWebhook, handleDeleteWebhook } from './store.js'
import { validateWebooks } from '../utils/validate.js'
import { combineWebhooks } from '../utils/combine.js'

// @desc: receive webhook from wyng
// route: POST /contest
// @access: Public
const handleContestWebhook = asyncHandler(async (req, res) => {
    console.log('handleContestWebhook req: ', req)
    console.log('credentials: ', credentials)
    console.log('handleContestWebhook incoming payload: ', req.body)

    // retrieve related webhooks in wyng, then combine data of all 3
    const webhooks = await handleGetWebhook(req, res)
    const complete = validateWebooks(req, res, webhooks)
    console.log('handleContestWebhook complete: ', complete)
    if (complete) {
        // combine data of all 3 webhooks
        const combined = combineWebhooks(req, res, webhooks)
        console.log('handleContestWebhook combined: ', combined)

        const timestamp = convertToUnixTime(req.body.submission_time)
        console.log('handleContestWebhook timestamp: ', timestamp)
        combined.timestamp = timestamp

        // send data to exponea
        
        const promises = []
        
        promises.push(contestSubmit(combined))
        
        promises.push(identifyCustomer(combined), doubleOptIn(combined), handleDeleteWebhook(req, res))
        
        const results = await Promise.all(promises)
        
        let resObj = {
            contestSubmit: results[0]
        }
        
        if (results[1]) {
            resObj.identifyCustomer = results[1]
        }
        if (results[2]) {
            resObj.doubleOptIn = results[2]
        }
        if (results[3]) {
            resObj.handleDeleteWebhook = results[3]
        }        
       // remove webhooks from S3 bucket (DISABLE FOR TESTING)
        // await handleDeleteWebhook(req, res)

        res.status(200).json(resObj)
    } else {
        // else if , store data in S3 bucket
        const stored = await handleStoreWebhook(req, res)
        console.log('handleContestWebhook stored: ', stored)
        res.status(200).json({ message: 'webhook stored in S3 bucket' })
    }


})

const contestSubmit = asyncHandler(async (req, res) => {
    const eventName = 'contest_destination_anywhere'
  
    const properties = generateTotalProps(req)
    // console.log('properties: ', properties)

    const auth = `${credentials.exponea_key}:${credentials.exponea_secret}`

    const endpoint =
        'https://api.exponea.com/track/v2/projects/' +
        credentials.exponea_token +
        '/customers/events'

    // console.log('auth: ', auth)
    // console.log('endpoint: ', endpoint)

    const hardId = (properties) => {
        const { local_user_id, email, phone_number } = properties
        const key = email ? 'email_id' : local_user_id ? 'registered' : 'phone_id'
        const value = email || local_user_id || phone_number
        return  { [key]: String(value) }
    }

    // console.log('timestamp: ', req.timestamp.toString())

    const payload = {
        customer_ids: hardId(properties),
        event_type: eventName,
        properties: properties,
        timestamp: req.timestamp.toString()
    }
    console.log('PAYLOAD TO EXPONEA: ', payload)

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${auth}`).toString('base64')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    const response = await fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('Success contest submit: ', result)
            return result;
        })
        .catch(error => error)

    const status = {
        message: 'Contest submission received',
        properties: properties,
        response: response,
    }
    return status
})

const identifyCustomer = asyncHandler(async (req, res) => {
    const eventName = 'identify'

    const properties = generateTotalProps(req)

    const auth = `${credentials.exponea_key}:${credentials.exponea_secret}`

    const endpoint =
        'https://api.exponea.com/track/v2/projects/' +
        credentials.exponea_token +
        '/customers'

        const hardId = (properties) => {
            const { local_user_id, email, phone_number } = properties
            const key = email ? 'email_id' : local_user_id ? 'registered' : 'phone_id'
            const value = email || local_user_id || phone_number
            return  { [key]: String(value) }
        }

    const payload = {
        customer_ids: hardId(properties),
        event_type: eventName,
        properties: properties
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${auth}`).toString('base64')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    const response = await fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('Success in exponea identify: ', result);
            return result;
        })
        .catch(error => error);

    const status = {
        message: 'Customer identified',
        response: response,
    }
    return status
})

const doubleOptIn = asyncHandler(async (req, res) => {
    const eventName = 'double_opt_in'
  
    let properties = generateTotalProps(req)
    
    // double opt in specific properties
    properties = {
        action: 'new',
        email: properties.email,
        phone: properties.phone_number,
        source: properties.email ? 'Destination Anywhere Contest Form' : 'Destination Anywhere Contest Form SMS',
        opt_in_type: properties.email ? 'email' : 'sms',
        marketing_signup: properties.accepts_marketing,
    }
  
    const auth = `${credentials.exponea_key}:${credentials.exponea_secret}`
  
    const endpoint =
        'https://api.exponea.com/track/v2/projects/' +
        credentials.exponea_token +
        '/customers/events'

    const hardId = (properties) => {
        const { local_user_id, email, phone_number } = properties
        const key = email ? 'email_id' : local_user_id ? 'registered' : 'phone_id'
        const value = email || local_user_id || phone_number
        return  { [key]: String(value) }
    }

    const payload = {
        customer_ids: hardId(properties),
        event_type: eventName,
        properties: properties,
        timestamp: req.timestamp.toString()
    }

    console.log('DOUBLE_OPT_IN PAYLOAD TO EXPONEA: ', payload)

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${auth}`).toString('base64')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
  
    const response = await fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('Success in double_opt_in: ', result);
            return result;
        })
        .catch(error => error);

    const status = {
        message: 'User opted into marketing',
        properties: properties,
        response: response,
    }
    return status
})

//---------------------------------------------------------------------
//                        HELPERS
//---------------------------------------------------------------------

const convertToUnixTime = (date) => {
  // defaults to milliseconds
  const timestamp = new Date(date).getTime()

  // Bloomreach's platform works with unix timestamps in seconds
  return Math.floor(timestamp / 1000)
}
//---------------------------------------------------------------------
//                        PROPERTIES
//---------------------------------------------------------------------

const generateCustomerProps = (body) => {
    let properties = {
        headshot: body.image ?? '',
        first_name: body.first ?? '',
        last_name: body.last ?? '',
        email: body.email_address ?? '',
        phone_number: body.phone_number ?? '',
        birth_month: body.birth_month ?? '',
        possible_gender: body.gender ?? '',
        chosen_country: body.country ?? '',
        swell_season: body.checkbox_7632337851805 ?? '',
        non_profit_url: body.url ?? '',
        accepts_marketing: body.opt_in ?? '',
        marketing_opt_in_level: body.opt_in ? 'single_opt_in' : '',
        local_user_id: body.local_user_id ?? '',
        us_citizen: body.opt_in ? body.checkbox_4802891705567 : '',
        why_org_chosen: body.textarea_7011079516184 ?? '',
        bio: body.textarea_1645047336373 ?? ''
    }
    return properties
}

const generateImageProps = (body) => {
    let properties = {
        image_caption: body.caption ?? '',
        image: body.image ?? ''
    }
    return properties
}

const generateVideoProps = (body) => {
    let properties = {
        video_caption: body.caption ?? '',
        video: body.video ?? '',
        thumbnail: body.thumbnail ?? ''
    }
    return properties
}

const generateTotalProps = (req) => {
   const customerProps = generateCustomerProps(req.sign_up)
    const imageProps = generateImageProps(req.image)
    const videoProps = generateVideoProps(req.video)

    const totalProps = {
        ...customerProps,
        ...imageProps,
        ...videoProps
    }

    return totalProps
}

export { handleContestWebhook, doubleOptIn }