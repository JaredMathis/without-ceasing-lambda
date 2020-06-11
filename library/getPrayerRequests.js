
const u = require("wlj-utilities");

const lib = require("without-ceasing-library");
const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports = getPrayerRequests;

async function getPrayerRequests(x) {
    const params = {
        Bucket: "without-ceasing-data",
        Prefix: "",
        MaxKeys: 100,
    };
    u.merge(x, { params });
    const response = await s3.listObjectsV2(params).promise();
    u.merge(x, () => response.Contents.length);

    let objects = [];
    let keys = response.Contents.map(c => c.Key);
    let promises = keys.map(async key => {
        let promise = s3.getObject({ 
            Bucket: "without-ceasing-data",
            Key: key,
        }).promise();
        let o = await promise;
        objects.push(o);
    });
    await Promise.all(promises);
    let jsons = objects.map(p => p.Body.toString());
    let prayers = jsons.map(JSON.parse);

    return prayers;
}
