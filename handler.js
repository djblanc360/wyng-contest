import dotenv from 'dotenv'
dotenv.config()

import serverless from 'serverless-http'
import app from './src/index.js'

const handler = serverless(app)
export { handler }

/** FOR TESTING */
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
  