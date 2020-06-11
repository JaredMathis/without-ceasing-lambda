
const u = require("wlj-utilities");
const { v4: uuidv4 } = require('uuid');
const wcRequestPrayer = require("../../library/wcRequestPrayer.js");
const index = require("../../index.js");

u.scope(__filename, x => {
    let log = false;
    let apigateway = require("./../../" + u.getAwsApiGatewayFileName());
    let parsed = u.awsLambdaApiCall(apigateway, wcRequestPrayer.name, { 
        userId: uuidv4(),
        name: "J",
        petition: 'Wisdom',
    });
    if (log) console.log(parsed.error);
    u.assert(() => parsed.success === true);
    u.assert(() => parsed.result === "Requested!");
});
