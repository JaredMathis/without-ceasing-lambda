
const u = require("wlj-utilities");
const lib = require("without-ceasing-library");
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports = wcPrayers;

async function wcPrayers(event, context, callback) {
    await u.awsScope(async (x) => {
        return await getPrayers(x);
    }, callback);
}

async function getPrayers(x) {
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
};