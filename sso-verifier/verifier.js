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
    console.log('\x1b[0m', `${new Date().toLocaleTimeString()} Success=[${Number(countSuccess).toLocaleString()}] Errors=[${Number(countFailure).toLocaleString()}]`);
}

setInterval(report, 1_000);

async function callEndpoint() {
    if (Date.now() > endTime) {
        report();
        console.log('\x1b[0m', 'Test reached target duration. Done');
        process.exit(0);
        return;
    }
    try {
        const user = Users[Math.round(Math.random() * (Users.length - 1))];
        const response = await axios({
            method: Config.HTTP_METHOD,
            url: `${Config.HTTP_URI}?userId=${user.id}`
        });
        const payload = response.data;
        const hashed = createHmac('sha256', API_KEY)
            .update(payload.timestamp + payload.userDataJSONBase64)
            .digest('hex');

        try {
            // Use timingSafeEqual to prevent timing attacks.
            if (timingSafeEqual(Buffer.from(hashed), Buffer.from(payload.verificationHash))) {
                if (Config.VERIFY_USER_DETAILS) {
                    const jsonStringUserData = Buffer.from(payload.userDataJSONBase64, 'base64').toString('utf8');
                    const userData = JSON.parse(jsonStringUserData);
                    let success = true;
                    for (const key in user) {
                        // noinspection EqualityComparisonWithCoercionJS - some backends don't differentiate null/undefined
                        if (userData[key] != user[key]) {
                            success = false;
                            console.error('\x1b[31m', `${new Date().toLocaleTimeString()} Bug: User=[${user.id}] Mismatch on ${key} - Test Data=[${user[key]}] API Provided=[${userData[key]}]`);                            success = false;
                        }
                    }
                    if (success) {
                        countSuccess++;
                    } else {
                        countFailure++;
                    }
                } else {
                    countSuccess++;
                }
            } else {
                countFailure++;
                console.error('\x1b[31m', `${new Date().toLocaleTimeString()} Bug: Data not hashed correctly!!! Do not ignore this!`);
            }
        } catch (e) {
            countFailure++;
            console.error('\x1b[31m', new Date().toLocaleTimeString(), 'ERROR', `${new Date().toLocaleTimeString()} Bug: Data not hashed correctly!!! Do not ignore this! Full error:`, e.message);
        }
    } catch (e) {
        console.error('\x1b[31m', new Date().toLocaleTimeString(), 'ERROR', e.message, e.data);
        countFailure++;
    }
    process.nextTick(callEndpoint);
}

for (let i = 0; i < Config.CONCURRENT_COUNT; i++) {
    // noinspection JSIgnoredPromiseFromCall
    callEndpoint();
}
