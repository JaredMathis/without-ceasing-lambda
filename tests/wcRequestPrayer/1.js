
const u = require("wlj-utilities");
const { v4: uuidv4 } = require('uuid');
const wcRequestPrayer = require("../../library/wcRequestPrayer.js");
const index = require("../../index.js");

u.scope(__filename, x => {
    let log = true;
    let apigateway = require("./../../" + u.getAwsApiGatewayFileName());
    let parsed = u.awsLambdaApiCall(apigateway, wcRequestPrayer.name, { 
        userId: "b3f40c3d-23ee-4663-bd7a-17079fd67b4f",
        name: "J",
        petition: 'Wisdom',
    });
    u.merge(x, {parsed});
    if (parsed.error) {
        u.merge(x, () => parsed.error);
        u.merge(x, () => Object.keys(parsed.error));
        u.merge(x, () => parsed.error.stack);
        u.merge(x, () => parsed.error.string);
        if (log) {
            console.log(parsed.error.stack);
            console.log(parsed.error.string);
        }
        if (parsed.error.e) {
            u.merge(x, () => parsed.error.e);
            if (parsed.error.e.context) {
                u.merge(x, () => parsed.error.e.context);
            }
        }
    }
    u.assert(() => parsed.success === true);
    u.assert(() => parsed.result === "Already requested!");
});
