
const u = require("wlj-utilities");
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports = wcPray;

async function wcPray(event, context, callback) {
    await u.awsScope(async (x) => {
        u.assertIsString(() => event.key);

        return await getPrayerRequest(x, event.key);
    }, callback);
}

async function getPrayerRequest(x, key) {
    let response = await s3.getObject({ 
        Bucket: "without-ceasing-data",
        Key: key,
    }).promise();
    let json = response.Body.toString()
    let prayer = JSON.parse(json);

    return prayer;
}