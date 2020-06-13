
const u = require("wlj-utilities");
require('without-ceasing-library');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const getPrayerRequest = require('./getPrayerRequest');

module.exports = wcPrayerRequest;

async function wcPrayerRequest(event, context, callback) {
    await u.awsScope(async (x) => {
        u.assertIsString(() => event.key);

        let result = await getPrayerRequest(x, event.key);

        return result;
    }, callback);
}