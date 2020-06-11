
const u = require("wlj-utilities");
const getPrayerRequests = require('./getPrayerRequests');

module.exports = wcPrayerRequests;

async function wcPrayerRequests(event, context, callback) {
    await u.awsScope(async (x) => {
        return await getPrayerRequests(x);
    }, callback);
}