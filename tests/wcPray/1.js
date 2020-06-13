
const u = require("wlj-utilities");

const wcRequestPrayer = require("../../library/wcRequestPrayer.js");
const wcPray = require("../../library/wcPray.js");
const wcPrayerRequest = require("../../library/wcPrayerRequest.js");
const index = require("../../index.js");
const getCountries = require("without-ceasing-library/library/getCountries");

u.scope(__filename, x => {
    let log = false;

    let apigateway = require("./../../" + u.getAwsApiGatewayFileName());
    let requestPrayer = u.awsLambdaApiCall(apigateway, wcRequestPrayer.name, { 
        userId: "b3f40c3d-23ee-4663-bd7a-17079fd67b4f",
        name: "J",
        petition: 'Wisdom',
    }, x);
    u.assert(() => requestPrayer.success === true);

    let key = requestPrayer.result.result.key;

    let countries = getCountries();

    let before = u.awsLambdaApiCall(apigateway, wcPrayerRequest.name, { 
        key,
    }, x);
    u.assert(() => before.success === true);
    let beforeLength = before.result.data.prayers.length;

    let countryId = 1;
    let country = countries[countryId];
    let pray = u.awsLambdaApiCall(apigateway, wcPray.name, { 
        key,
        country,
    }, x);
    u.assert(() => pray.success === true);

    let after = u.awsLambdaApiCall(apigateway, wcPrayerRequest.name, { 
        key,
    }, x);

    if (log) {
        console.log(__filename);
        console.log(JSON.stringify({after}, null, 2));
    }

    u.assert(() => after.success === true);
    let afterPrayers = after.result.data.prayers;
    let afterLength = afterPrayers.length;

    u.assert(() => afterLength === beforeLength + 1);
    u.assert(() => afterPrayers[afterPrayers.length - 1].countryId === countryId)
});
