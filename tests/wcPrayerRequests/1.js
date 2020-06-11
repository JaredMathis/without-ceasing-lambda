
const u = require("wlj-utilities");
const lib = require('without-ceasing-library');
const { v4: uuidv4 } = require('uuid');
const wcPrayerRequests = require("../../library/wcPrayerRequests.js");
const index = require("../../index.js");

u.scope(__filename, x => {
    let log = false;
    let apigateway = require("./../../" + u.getAwsApiGatewayFileName());
    let parsed = u.awsLambdaApiCall(apigateway, wcPrayerRequests.name, {
    }, x);
    if (log) console.log(parsed);
    u.assert(() => parsed.success === true);
    u.assert(() => u.isArray(parsed.result));
    u.assert(() => parsed.result.length >= 1);
    let p = parsed.result[0].request;
    u.merge(x, {p});
    u.assert(() => u.isGuid(p.userId));
    u.assert(() => 0 <= p.nameId);
    u.assert(() => p.nameId < lib.getNames().length);
    u.assert(() => 0 <= p.petitionId);
    u.assert(() => p.petitionId < lib.getPetitions().length);
});
