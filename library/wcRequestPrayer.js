
const u = require("wlj-utilities");
const lib = require("without-ceasing-library");
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const getPrayerRequests = require('./getPrayerRequests');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports = wcRequestPrayer;

async function wcRequestPrayer(event, context, callback) {
    await u.awsScope(async (x) => {

        let request = lib.toRequest(event);

        let requests = await getPrayerRequests(x);
        for (let r of requests) {
            if (u.propertiesAreEqual(
                r.request,
                request,
                ['userId', 'petitionId', 'nameId']
            )) {
                return 'Already requested!'
            }
        }

        await requestPrayer(x, request);

        return "Requested!";
    }, callback);
}

async function requestPrayer(x, request) {
    let now = new Date();

    let month = u.padNumber(now.getMonth() + 1, 2);
    let day = u.padNumber(now.getDate(), 2);
    let date = `${now.getFullYear()}/${month}/${day}`;

    let time = `${now.getHours()}/${now.getMinutes()}`;

    let eventId = uuidv4();
    let key = `${date}/${time}/${eventId}`;
    u.merge(x, { key });
    const params = {
        Bucket: "without-ceasing-data",
        Key: key,
        Body: JSON.stringify({
            request,
        }),
    };
    u.merge(x, { params });

    const response = await s3.upload(params).promise();
    return { key };
};