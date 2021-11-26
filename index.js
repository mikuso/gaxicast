const {request} = require('gaxios');
const {resolve} = require('dns/promises');

module.exports = async function(opts) {
    if (!opts.url) {
        throw Error('URL is required.');
    }

    if (!opts.headers) {
        opts.headers = {};
    }

    if (!opts.rrTypes) {
        opts.rrTypes = ['A', 'AAAA'];
    }

    const originalUrl = new URL(opts.url);

    if (!('host' in opts.headers)) {
        opts.headers.host = originalUrl.host;
    }

    const addresses = [];
    let lookupErr;
    await Promise.all(opts.rrTypes.map(async (rrType) => {
        try {
            const records = await resolve(originalUrl.hostname, rrType);
            addresses.push(...records);
        } catch (err) {
            lookupErr = err;
        }
    }));

    if (!addresses.length) {
        if (lookupErr) {
            throw lookupErr;
        } else {
            throw Error(`No resource records found for '${originalUrl.hostname}'`);
        }
    }

    const responses = await Promise.all(addresses.map(async (address) => {
        try {
            const requestUrl = new URL(opts.url);
            requestUrl.hostname = address;

            const res = await request({
                ...opts,
                url: requestUrl.toString()
            });

            res.address = address;
            return res;
        } catch (err) {
            err.address = address;
            return err;
        }
    }));

    return responses;
};
