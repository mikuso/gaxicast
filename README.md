# Gaxicast

Use this to "broadcast" an HTTP request to all servers behind a name.  Based on [gaxios](https://www.npmjs.com/package/gaxios).

Returns an array of responses/errors from each address.

# Usage Example

```js
const request = require('@flamescape/gaxicast');

const responses = await request({
    url: 'https://example.org',
    rrTypes: ['A', 'AAAA'] // defaults to ['A']
    // all other options same as gaxios
});

console.log(responses); // { ..., address: 'x.x.x.x' }
```
