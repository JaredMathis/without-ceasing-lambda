
const u = require("wlj-utilities");
require('without-ceasing-library');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const getCountries = require("without-ceasing-library/library/getCountries");
const getPrayerRequest = require("./getPrayerRequest");

module.exports = wcPray;

async function wcPray(event, context, callback) {
    await u.awsScope(async (x) => {
        u.assertIsString(() => event.key);
        u.assertIsString(() => event.country);

        let countries = getCountries();
        let countryId = countries.indexOf(event.country);
        u.assert(() => countryId >= 0);

        let result = await getPrayerRequest(x, event.key);
        if (!result.data.prayers) {
            result.data.prayers = [];
        }
        result.data.prayers.push({countryId});

        await updatePrayerRequest(x, result);

        return 'Prayed!';
    }, callback);
}

async function updatePrayerRequest(x, result) {
    const params = {
        Bucket: "without-ceasing-data",
        Key: result.key,
        Body: JSON.stringify(result),
    };
    u.merge(x, { params });

    const response = await s3.upload(params).promise();
    return result;
};