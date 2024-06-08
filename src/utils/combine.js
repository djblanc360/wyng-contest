// @desc: combine req.body.normalized submission of incoming webhook
// and webhooks[].data of saved webhooks into the req.body.normalized_submission
// @access: Private
const combineWebhooks = (req, res, webhooks) => {
    const type = req.headers['wyng-submission-type']
    const normalized_submission = req.body.normalized_submission
    const data = webhooks.map(webhook => webhook.data)
    // iterate over each object in data array
    let combined = []
    data.forEach(object => {
        combined[object.submission_type] = object
    })
    combined[type] = normalized_submission
    
    return combined
}

export { combineWebhooks }