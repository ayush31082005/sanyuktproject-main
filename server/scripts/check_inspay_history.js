const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

async function check() {
    if (!MONGO_URI) {
        console.error('MONGO_URI is not defined in .env');
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const Transaction = mongoose.model('Transaction', new mongoose.Schema({}, { strict: false }));

        console.log('\n--- SEARCHING FOR INSPAY TRANSACTIONS ---');
        const transactions = await Transaction.find({ 
            $or: [
                { paymentMethod: 'inspay' },
                { transactionId: /TXN_IN/i }
            ]
        }).sort({ createdAt: -1 }).limit(50).lean();

        if (transactions.length === 0) {
            console.log('No Inspay transactions found in DB.');
        } else {
            transactions.forEach(t => {
                console.log(`ID: ${t._id}, Amount: ${t.amount}, Status: ${t.status}, Mobile: ${t.rechargeNumber}, TxID: ${t.transactionId || 'N/A'}, Date: ${t.createdAt}`);
                if (t.status === 'success') {
                    console.log(`  [SUCCESS] OrderID used: ${t.transactionId}`);
                }
            });
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

check();
