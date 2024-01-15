
# Jaxa

Jaxa is a lightweight NodeJS class wich can make transparents HTTP & HTTPS requests across the web.
## Installation

Install Jaxa with npm

```bash
npm i jaxa
```
## Documentation

### Jaxa.request(url[, options][, callbacks])
### Jaxa.request(options[, callbacks])

- `url` \<string\>
- `options` \<Object\>
    - Refere to [node:https documention](https://nodejs.org/api/https.html#httpsrequesturl-options-callback) for options argument.
- `callbacks` \<Object\>
    - `data` \<function\>
    - `end` \<function\>
    - `error` \<function\>
    - `callback` \<function\>
- Returns: \<Promise\>

Request method can be surchaged if you don't want to use an URL. `options` argument is based on the http & https nodejs documention, check the [documention](https://nodejs.org/api/https.html#httpsrequesturl-options-callback) for more details.
In addition, Jaxa allow callback fonctions during the lifecycle request.

> [!NOTE]
> We added `body` attribute in `options` argument to provide you a way to send data. `body` accept **ONLY** string.

### Callbacks

Callbacks can modify Jaxa comportement during his lifecycle. There is three hooks thats you can define:

- `data`: Data callback give you `chunk` variable which is received during call consumption and `data` which is received content since the start of the query. By default, Jaxa concatenates these chunks into data variable.
- `end`: End callback give you `end` variable. In simple terms, this is the result of concatenating the chunks, i.e. the final result of the query.
- `error`: Error callback give you `error` variable, which describe error during request process.  

> [!TIP]
> Lifecycle hook can be overriden when `callback` attribute is declared in callbacks argument. `callback`function give you three variables, first one is HTTP/HTTPS response, second and third are resolve and reject function of the promise.

### Pre implemented methods

Pre implemented methods are simply a rewrite of arguments passed to `request`function. They are listed below, along with the additions they make to objects.

| Methods  | Request object passed |
| :------- | :-------------------- |
| get      | { method: 'GET'}      |
| post     | { method: 'POST'}     |
| put      | { method: 'PUT'}      |
| delete   | { method: 'DELETE'}   |
| connect  | { method: 'CONNECT'}  |
| options  | { method: 'OPTIONS'}  |
| trace    | { method: 'TRACE'}    |
| patch    | { method: 'PATCH'}    |
| head     | { method: 'HEAD'}     |

> [!TIP]
> These functions can be called directly on the Jaxa instance. Check example below for more.

### Example

``` 
import Jaxa from 'Jaxa';

const new jaxa = new Jaxa();

// Historical Jaxa script function
jaxa.request('https://jsonplaceholder.typicode.com/posts/1')

// Pre implemented method 'POST'
jaxa.post('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
    }),
    headers: {
    'Content-type': 'application/json; charset=UTF-8',
    }
})
.then(res => console.log(res))

// Pre implemented method 'PATCH' with redifined callback
jaxa.patch({
    body: JSON.stringify({
        title: 'foo',
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
    protocol: 'https:',
    hostname: 'jsonplaceholder.typicode.com',
    path: '/posts/1'
},
{
    callback: (res, resolve, reject) => {
        let data = '';

        res
        .on('data', (chunk) => {
            data += chunk;
        })
        .on('end', () => {
            resolve(data);
        })
        .on('error', (err) => {
            reject(err);
        })
    }
})
.then(res => console.log(res))

```