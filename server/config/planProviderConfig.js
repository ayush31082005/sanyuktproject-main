const PLAN_API_URL = process.env.EKYCHUB_PLAN_API_URL || 'https://connect.ekychub.in/v3/verification/operator_plan_fetch';
const OPERATOR_FETCH_API_URL = process.env.EKYCHUB_OPERATOR_FETCH_API_URL || 'https://connect.ekychub.in/v3/verification/operator_fetch';

// Plan provider opcode mapping (can differ from recharge execution opcodes)
const PLAN_OPERATOR_OPCODES = {
    airtel: 'A',
    vi: 'V',
    vodafone: 'V',
    vodaone: 'V',
    jio: 'J',
    bsnl: 'BT',
    bsnl_topup: 'BT',
    bsnl_stv: 'BS'
};

const CIRCLE_CODES = {
    JHARKHAND: '105',
    MIZZORAM: '104',
    MEGHALAY: '103',
    GOA: '102',
    CHHATISGARH: '101',
    TRIPURA: '100',
    SIKKIM: '99',
    AP: '49',
    KERALA: '95',
    TAMIL_NADU: '94',
    CHENNAI: '40',
    KARNATAKA: '06',
    BIHAR: '52',
    NESA: '16',
    ASSAM: '56',
    ORISSA: '53',
    WEST_BENGAL: '51',
    KOLKATTA: '31',
    RAJASTHAN: '70',
    MP: '93',
    GUJARAT: '98',
    MAHARASHTRA: '90',
    MUMBAI: '92',
    UP_EAST: '54',
    J_AND_K: '55',
    HARYANA: '96',
    HP: '03',
    PUNJAB: '02',
    UP_WEST: '97',
    DELHI: '10'
};

const resolvePlanOpcode = (operator) => {
    if (!operator) return null;
    const normalized = String(operator).trim().toLowerCase().replace(/[\s-]+/g, '_');
    return PLAN_OPERATOR_OPCODES[normalized] || String(operator).trim().toUpperCase();
};

module.exports = {
    PLAN_API_URL,
    OPERATOR_FETCH_API_URL,
    PLAN_OPERATOR_OPCODES,
    CIRCLE_CODES,
    resolvePlanOpcode
};
