
const u = require("wlj-utilities");

const wcRequestPrayer = require("../../library/wcRequestPrayer.js");
const wcPray = require("../../library/wcPray.js");
const index = require("../../index.js");

u.scope(__filename, x => {
    let apigateway = require("./../../" + u.getAwsApiGatewayFileName());
    let requestPrayer = u.awsLambdaApiCall(apigateway, wcRequestPrayer.name, { 
        userId: "b3f40c3d-23ee-4663-bd7a-17079fd67b4f",
        name: "J",
        petition: 'Wisdom',
    }, x);
    u.assert(() => requestPrayer.success === true);

    let key = requestPrayer.result.result.key;

    let pray = u.awsLambdaApiCall(apigateway, wcPray.name, { 
        key,
    }, x);
    u.assert(() => pray.success === true);
    console.log(__filename);
    console.log(pray.result);
});
