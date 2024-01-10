
# Jaxa

Jaxa is a lightweight NodeJS script wich can make transparents HTTP & HTTPS requests across the web.
## Installation

Install Jaxa with npm

```bash
npm i jaxa
```
## Documentation

### Jaxa(url[, options][, callbacks])
### Jaxa(options[, callbacks])

- `url` <string>
- `options` <Object>
    - Refere to [node:https documention](https://nodejs.org/api/https.html#httpsrequesturl-options-callback) for options argument.
- `callbacks` <Object>
    - `data` <function>
    - `end` <function>
    - `error` <function>

Jaxa can be surchaged if you don't want to use an URL. `options` argument is based on the http & https nodejs documention, check the [documention](https://nodejs.org/api/https.html#httpsrequesturl-options-callback) for more details. In addition, Jaxa allow callback fonctions during the lifecycle request.

### Callbacks

Callbacks can modify Jaxa comportement during his lifecycle. There is three hooks thats you can define:

- `data`: Data callback give you `chunk` variable which is received during call consumption. By default, Jaxa concatenates these chunks.
- `end`: End callback give you `end` variable. In simple terms, this is the result of concatenating the chunks, i.e. the final result of the query.
- `error`: Error callback give you `error` variable, which describe error during request process.

Example

``` 
{
    'end': (res) => res.json()
    'error': (error) => throw Error(error)
}
```