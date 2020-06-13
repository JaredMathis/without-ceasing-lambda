
const u = require("wlj-utilities");
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports = getPrayerRequest;

async function getPrayerRequest(x, key) {
    let response = await s3.getObject({ 
        Bucket: "without-ceasing-data",
        Key: key,
    }).promise();
    let json = response.Body.toString()
    let prayer = JSON.parse(json);

    return prayer;
}
