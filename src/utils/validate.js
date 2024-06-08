import { submissionTypes } from '../data/types.js'

// @desc: determine if each received webhook meets the criteria of submission type
// @access: Private
const validateWebooks = (req, res, webhooks) => {
    // console.log('validateWebooks req.body.campaign:', req.body.campaign)
    const setSubmissionTypes = submissionTypes(req.body.campaign)
    // console.log('validateWebooks setSubmissionTypes: ', setSubmissionTypes)

    const type = req.headers['wyng-submission-type']
    const webhookData = webhooks.map(webhook => webhook.data)
    // console.log('validateWebooks - webhookData: ', webhookData)
    const webhookType = webhookData.map(data => data.submission_type)
    webhookType.push(type)
    // console.log('validateWebooks - webhookType: ', webhookType)

    // Check if each submission type from webhook is unique
    const uniqueWebhookTypes = [...new Set(webhookType)]
    // console.log('validateWebooks - uniqueWebhookTypes: ', uniqueWebhookTypes)

    // Check if each unique submission type from data exists in the given array
    const allTypesMatch = uniqueWebhookTypes.every(type => setSubmissionTypes.includes(type))
    // console.log('validateWebooks - allTypesMatch: ', allTypesMatch)

    // Check if the number of unique submission types matches the given array's length
    const sameNumberOfTypes = uniqueWebhookTypes.length === setSubmissionTypes.length
    // console.log('validateWebooks - sameNumberOfTypes: ', sameNumberOfTypes)

    if (allTypesMatch && sameNumberOfTypes) {
        return true
    } else {
        let errors = [];

        if (!allTypesMatch) {
            errors.push('Some submission types from data are not in the given array.')
        }

        if (!sameNumberOfTypes) {
            errors.push('The number of unique submission types does not match the given array length.')
        }
        console.log('validateWebooks errors: ', errors)
        return false
    }
}

export { validateWebooks }