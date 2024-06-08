# Wyng Contest

Middleware for sending Wyng contest data to Bloomreach

## Description

An in-depth paragraph about your project and overview of use.

## Getting Started

### Dependencies

* aws-sdk: allows developers to interact with Amazon Web Services (AWS) directly from their JavaScript applications, enabling functionalities such as S3 uploads, DynamoDB operations, and Lambda function invocations

* body-parser:  middleware for Express.js applications, used to parse incoming request bodies, making it easier to handle POST requests with JSON, URL-encoded, or other formatted data

* cors: a middleware for Express.js to enable Cross-Origin Resource Sharing (CORS), allowing web applications hosted on different domains to communicate with your server

* dot-env: allows developers to load environment variables from a .env file into process.env in Node.js applications, offering a convenient way to manage configuration settings

* express: a minimal and flexible Node.js web application framework, providing a robust set of tools for building web APIs and applications

* express-async-handler: a middleware for Express.js that handles exceptions within asynchronous route handlers and passes them to the application's central error-handling mechanism

* node-fetch: a lightweight module that brings the browser's Fetch API to Node.js, enabling developers to make HTTP requests in a more modern way than the native http and https modules

* serverless-http: a tool that enables Express.js applications to be deployed within serverless frameworks, such as AWS Lambda, converting HTTP requests/responses to formats compatible with these platforms

### Installing

1. Install dependencies on local environment
```
npm install
```

2. Ensure the region is set to us-west-2 in serverless.yml
```
provider:
  name: aws
  runtime: nodejs14.x
  region: us-west-2
```

### Executing program

1. How to run the program
2. Step-by-step bullets
```
code blocks for commands
```
### Deploying

run the following command in terminal
```
sls deploy
```
## Debugging Locally
1. go to root directory
2. run the following command in terminal
```
node handler.js
```
3. endpoints should be in http://localhost:8000 or localURL in wyng environment in POSTMAN
## Debugging
1. Go to AWS Cloudwatch
2. Find log group: antavo-aws-loyalty-triage-dev-api
3. run query to filter the events of a particular user:
```
fields @timestamp, @message
| filter @message like /{{user.email}} - /
| sort @timestamp desc
| limit 40
```
## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Potential Future Updates
* features to be added or desired

## Authors

* [@Daryl Blancaflor](dblancaflor@arch-cos.com), formally dblancaflor@olukai.com

## Version History

* 0.1
    * Initial Release
    * receives all 3 weebhooks from wyng
    * only the webhook with the customer's email successfully makes it to Bloomreach
    * identifies user in Exponea
    * triggers contest_destination_anywhere event


## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)