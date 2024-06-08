
// Middleware to set global variables based on the domain
const setGlobalVars = (req, res, next) => {
    const domainCredentials = {
        'roark.com': {
            url: 'the-roark-revival.myshopify.com',
            wyng_app_id: process.env.ROARK_WYNG_APP_ID,
            wyng_token: process.env.ROARK_WYNG_TOKEN,
            exponea_key: process.env.ROARK_EXPONEA_KEY,
            exponea_secret: process.env.ROARK_EXPONEA_SECRET,
            exponea_token: process.env.ROARK_EXPONEA_TOKEN
        },
        'dev-roark.myshopify.com': {
            url: 'dev-roark.myshopify.com',
            wyng_app_id: process.env.ROARK_WYNG_APP_ID,
            wyng_token: process.env.ROARK_WYNG_TOKEN,
            exponea_key: process.env.ROARK_EXPONEA_KEY_DEV,
            exponea_secret: process.env.ROARK_EXPONEA_SECRET_DEV,
            exponea_token: process.env.ROARK_EXPONEA_TOKEN_DEV
        },
        'vip.roark.com': {
            url: 'roark-vip.myshopify.com',
            wyng_app_id: process.env.ROARK_WYNG_APP_ID,
            wyng_token: process.env.ROARK_WYNG_TOKEN,
            exponea_key: process.env.ROARK_EXPONEA_KEY,
            exponea_secret: process.env.ROARK_EXPONEA_SECRET,
            exponea_token: process.env.ROARK_EXPONEA_TOKEN
        }
    }

    // const { domain } = req.body
    const shopifyDomain = req.headers['x-shopify-shop-domain']
    console.log('credentials.js - req.headers: ', shopifyDomain)
    

    // HARD-CODED FOR WEBHOOK
    const domain = 'dev-roark.myshopify.com'
    console.log('credentials.js - domain: ', domain)

    if (!domain || !domainCredentials[domain]) {
        return res.status(400).json({ message: 'credentials.js - Invalid or missing domain' })
    }

    // Set the global variables with domain credentials
    global.credentials = domainCredentials[domain]

    next()
}


export { setGlobalVars }