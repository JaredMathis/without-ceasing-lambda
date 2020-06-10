
const u = require("wlj-utilities");
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports = wcRequestPrayer;

async function wcRequestPrayer(event, context, callback) {
    await u.awsScope(async (x) => {
        u.assert(() => u.isGuid(event.userId));        

        let request = {
            userId: event.userId,
            petition: event.petition,
        }

        await saveData(x, request);

        return "Requested!";
    }, callback);
}

async function saveEvent(x, event) {
    let eventId = v4();
    u.merge(event, {eventId});
    const params = {
        Bucket:  "without-ceasing-data",
        Key: eventId,
        Body: JSON.stringify(event),
    };
    u.merge(x, {params});

    const response = await s3.upload(params).promise();
    return response;
};