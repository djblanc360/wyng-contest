/* global credentials */

import asyncHandler from 'express-async-handler'
// @desc: Add a text content item to library
// route: POST /content
// @access: Public

const addContentItemText = asyncHandler(async (req, res) => {
    const { test } = req.body
    const payload = {
        "content": {
            "text": `Text content item created with text: ${test}`,
            "app_id": credentials.wyng_app_id
        },
    }
    // res.status(201).json(`Text content item created with text: ${test}`)
    res.status(201).json(payload)
})

// @desc: Add a image content item to library
// route: POST /content/image
// @access: Public

const addContentItemImage = asyncHandler(async (req, res) => {
    const { content_url, content_type, caption, submission } = req.body
    const payload = {
        "content_url": content_url,
        "content_type": content_type,
        "caption": caption,
        "submission": submission,
    }
    const url = `https://content-api.wyng/v2/content/?access_token=${credentials.wyng_token}`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            payload
        })
    })
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    res.status(201).json(data)
})

export { addContentItemText, addContentItemImage }