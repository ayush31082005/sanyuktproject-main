// Inspay OP code mapping (source of truth should remain Inspay commission/operator list)
const INSPAY_OPERATOR_OPCODES = {
    // Mobile
    airtel: 'A',
    jio: 'RC',
    vi: 'V',
    bsnl: 'BT', // Defaulting BSNL to TOPUP. Use BR when STV-specific UI is added.
    bsnl_topup: 'BT',
    bsnl_stv: 'BR',

    // DTH
    airteldth: 'ATV',
    sundth: 'STV',
    tataplay: 'TTV',
    videocondth: 'VTV',
    d2h: 'VTV', // Current UI uses d2h id for Videocon d2h
    dishtv: 'DTV',

    // Gift card
    googleplay: 'GPC',
    googleplaygiftcard: 'GPC',
    gpc: 'GPC',

    // Existing aliases in older code
    rj: 'RC',
    vtv: 'VTV',
    ttv: 'TTV',
    dtv: 'DTV',
    atv: 'ATV'
};

const resolveOpCode = (operator) => {
    if (!operator) return null;
    const normalized = String(operator).trim().toLowerCase().replace(/[\s-]+/g, '');
    return INSPAY_OPERATOR_OPCODES[normalized] || String(operator).trim().toUpperCase();
};

module.exports = {
    INSPAY_OPERATOR_OPCODES,
    resolveOpCode
};
