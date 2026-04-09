const axios = require('axios');
const qs = require('querystring');
require('dotenv').config({ path: '../.env' });

const credentials = {
    username: process.env.INSPAY_USERNAME || "IP9628145157",
    token: process.env.INSPAY_TOKEN || "6392ddec58adf77d49455bfa17107ebd"
};

const test = async (idKey, idValue, amount = "15") => {
    const url = "https://www.connect.inspay.in/v3/recharge/api";
    const rawUsername = credentials.username.replace(/^IP/, '');
    
    const payload = {
        username: rawUsername,
        token: credentials.token,
        opcode: "RJ",
        amount: amount,
        number: "9" + Math.floor(100000000 + Math.random() * 900000000).toString()
    };
    payload[idKey] = idValue;

    console.log(`\nTesting: Request Key=${idKey}, Value=${idValue}, Amount=${amount}`);
    
    try {
        const res = await axios.post(url, qs.stringify(payload), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 15000
        });
        console.log(`Response: ${JSON.stringify(res.data)}`);
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
};

const runTests = async () => {
    const ord = Date.now().toString();

    // Test txn_id
    await test("txn_id", ord);
    
    // Test requestId
    await test("requestId", ord);

    // Test orderid with amount 100
    await test("orderid", ord, "100");

    // Test orderid with amount 1000 (User's amount)
    await test("orderid", ord, "1000");
};

runTests();
