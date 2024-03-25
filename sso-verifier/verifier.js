const API_KEY = process.env.API_KEY;
const Config = require('./config.json');
const axios = require('axios');
const {createHmac, timingSafeEqual} = require('crypto');

if (!API_KEY) {
    throw new Error('API_KEY env variable required!');
}

if (!Config.HTTP_URI) {
    throw new Error('Set HTTP_URI in config.json!');
}

const Users = Config.users;

console.log('Running for', Users.length, 'users.');

let countSuccess = 0;
let countFailure = 0;
let endTime = Config.DURATION_MS > -1 ? Date.now() + Config.DURATION_MS : Infinity;

function report() {
    console.log(`Success=[${Number(countSuccess).toLocaleString()}] Errors=[${Number(countFailure).toLocaleString()}]`);
}

setInterval(report, 1_000);

async function callEndpoint() {
    if (Date.now() > endTime) {
        report();
        console.log('Test reached target duration. Done');
        process.exit(0);
        return;
    }
    try {
        const user = Users[Math.round(Math.random() * Users.length - 1)];
        const response = await axios({
            method: Config.HTTP_METHOD,
            url: `${Config.HTTP_URI}?userId=${user}`
        });
        const payload = response.data.payload;
        const hashed = createHmac('sha256', API_KEY)
            .update(payload.timestamp + payload.userDataJSONBase64)
            .digest('hex');

        // Use timingSafeEqual to prevent timing attacks.
        if (timingSafeEqual(Buffer.from(hashed), Buffer.from(payload.verificationHash))) {
            countSuccess++;
        } else {
            countFailure++;
            console.error('\x1b[31m', 'Bug: Data not hashed correctly!!! Do not ignore this!');
        }
    } catch (e) {
        console.error('\x1b[31m', e);
        countFailure++;
    }
}

for (let i = 0; i < Config.CONCURRENT_COUNT; i++) {
    // noinspection JSIgnoredPromiseFromCall
    callEndpoint();
}
