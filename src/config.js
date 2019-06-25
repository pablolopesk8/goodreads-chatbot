/**
 * Config file that get env data and makes other configurations
 */
"use strict";

require('dotenv').config({ path: __dirname + '/env/.env' });

module.exports = {
    portApi: process.env.PORT_API || 3000,
    env: process.env.ENV || 'dev',
    serverUrl: process.env.SERVER_URL,

    // database variables
    mongodbUser: MONGODB_USER,
    mongodbPass: process.env.MONGODB_PASS,
    mongodbHost: process.env.MONGODB_HOST,
    mongodbPort: process.env.MONGODB_PORT,
    mongodbDatabase: process.env.MONGODB_DATABASE,

    // facebook variables
    facebookPageId: process.env.FACEBOOK_PAGE_ID,
    facebookPageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
    facebookVerifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
    facebookPlatformDomain: "https://graph.facebook.com",
    facebookPlatformVersion: "v3.2",
    facebookGraphUrl = `${this.facebookPlatformDomain}/${this.facebookPlatformVersion}`,
    facebookWebhookUrl = `${this.serverUrl}/webhook`,

    // goodreads variables
    goodreadsAppName: process.env.GOODREADS_APP_NAME,
    goodreadsKey: process.env.GOODREADS_KEY,
    goodreadsSecret: process.env.GOODREADS_SECRET,
    goodreadsBaseUrl: `https://www.goodreads.com/`,
    goodreadsSearchBooksByTitleUrl: `${this.goodreadsBaseUrl}/search/index.xml`,
    goodreadsSearchBookByIdUrl: `${this.goodreadsBaseUrl}/book/show/`,
    goodreadsGetReviewByIsbnUrl: `${this.goodreadsBaseUrl}/api/reviews_widget_iframe`,

    // ibm variables
    watsonApiVersion: '2018-11-16',
    watsonNluKey: process.env.IBM_WATSON_NLU_KEY,
    watsonNluBaseUrl: process.env.IBM_WATSON_NLU_BASE_URL,
    watsonNluFullUrl: `${this.watsonNluBaseUrl}/v1/analyze`
}