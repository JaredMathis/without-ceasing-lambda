
const u = require("wlj-utilities");
const { v4: uuidv4 } = require('uuid');
const wcRequestPrayer = require("../../library/wcRequestPrayer.js");
const index = require("../../index.js");

u.scope(__filename, x => {
    let apigateway = require("./../../" + u.getAwsApiGatewayFileName());
    let parsed = u.awsLambdaApiCall(apigateway, wcRequestPrayer.name, { 
        userId: "b3f40c3d-23ee-4663-bd7a-17079fd67b4f",
        name: "J",
        petition: 'Wisdom',
    }, x);

    u.assert(() => parsed.success === true);
    u.assert(() => ["Already requested!", "Requested!"].includes(parsed.result.message));
});
