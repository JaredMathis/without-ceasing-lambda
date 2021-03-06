
const u = require("wlj-utilities");
const lib = require("without-ceasing-library");
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const { v4: uuidv4 } = require('uuid');
const getPrayerRequests = require('./getPrayerRequests');
const merge = require("wlj-utilities/library/merge");

module.exports = wcRequestPrayer;

async function wcRequestPrayer(event, context, callback) {
    await u.awsScope(async (x) => {

        let request = lib.toRequest(event);

        let requests = await getPrayerRequests(x);
        for (let r of requests) {
            merge(x,{r});
            if (u.propertiesAreEqual(
                r.data.request,
                request,
                ['userId', 'petitionId', 'nameId']
            )) {
                return { result: r, message: 'Already requested!' };
            }
        }

        let result = await requestPrayer(x, request);
        return { result, message: 'Requested!' };
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
    let result = {
        key,
        data: { request },
    };
    const params = {
        Bucket: "without-ceasing-data",
        Key: key,
        Body: JSON.stringify(result),
    };
    u.merge(x, { params });

    const response = await s3.upload(params).promise();
    return result;
};