const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Manually parse .env to avoid 'dotenv' dependency
const dotenvPath = path.join(__dirname, 'server', '.env');
const envContent = fs.readFileSync(dotenvPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        env[match[1]] = value;
    }
});

const Withdrawal = require('./server/models/Withdrawal');

const checkDB = async () => {
    try {
        if (!env.MONGO_URI) throw new Error('MONGO_URI not found in .env');
        console.log('Connecting to:', env.MONGO_URI.split('@')[1] || 'LocalDB');
        await mongoose.connect(env.MONGO_URI);
        const count = await Withdrawal.countDocuments();
        const withdrawals = await Withdrawal.find().populate('userId', 'userName memberId').limit(5);
        console.log(`Total Withdrawals: ${count}`);
        console.log('Sample Data:', JSON.stringify(withdrawals, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('CheckDB Error:', err.message);
        process.exit(1);
    }
};

checkDB();
