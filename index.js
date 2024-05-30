const https = require("https");
const http = require("http");

const protocols = { https, http };

module.exports = class Jaxa{
    constructor(){
        const argumentsArray = Object.values(arguments)
        
        this.default = {};

        switch(argumentsArray.length){
            case 0:
                break;
            case 1:
                const objectKeys = Object.keys(argumentsArray[0])
                if(['data', 'end', 'error', 'callback'].filter((key) => objectKeys.includes(key)).length > 0 || objectKeys.length == 0)
                    this.default.callbacks = argumentsArray[0];
                else
                    this.default.options = argumentsArray[0];
                break;
            case 2:
                this.default.options = argumentsArray[0];
                this.default.callback = argumentsArray[1];
                break;
            default:
                throw Error(`Two or less arguments expected but ${argumentsArray.length} given`)
        }

    }

    request(){
        const item = this;
        let { requestArguments, callbacks } = surchage(...arguments);

        if(this.default.options)
            requestArguments = overrideOptions(requestArguments, this.default.options)

        const options = getLastArgument(requestArguments);

        const protocol = typeof requestArguments[0] == "string" ? 
            new URL(requestArguments[0]).protocol.slice(0, -1) :
            options.protocol.slice(0, -1);
    
        if(!protocols[protocol])
            throw Error('Wrong protocol');
    
        return new Promise(
            (resolve, reject) => {
            const req = protocols[protocol].request(...requestArguments, callbacks.callback ? (res) => callbacks.callback.apply(item, [res, resolve, reject])  : (res) => {
                let data = [];

                res
                .on('data', (chunk) => {
                    callbacks.data ?
                        callbacks.data.apply(item, [chunk, data]) :
                        data.push(chunk);
                })
                .on('end', () => {
                    resolve(callbacks.end ? callbacks.end.apply(item, [data]) : Buffer.concat(data));
                })
                .on('error', (err) => {
                    reject(callbacks.error ? callbacks.error.apply(item, [err]) : err);
                })
    
            })

            if(options.body)
                req.write(options.body)
            
            req.end();
        });
    }

    get(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'GET' }, true), callbacks);
    }

    post(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'POST' }, true), callbacks);
    }

    put(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'PUT' }, true), callbacks);
    }

    delete(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'DELETE' }, true), callbacks);
    }

    connect(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'CONNECT' }, true), callbacks);
    }

    options(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'OPTIONS' }, true), callbacks);
    }

    trace(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'TRACE' }, true), callbacks);
    }

    patch(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'PATCH' }, true), callbacks);
    }

    head(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideOptions(requestArguments, { method: 'HEAD' }, true), callbacks);
    }

}

function overrideOptions(array, options, force = false){
    let lastArgument = getLastArgument(array);

    typeof lastArgument == 'string' ?
        array.push(options) : 
        force ?
            array.splice(-1, 1, { ...lastArgument, ...options }) :
            array.splice(-1, 1, { ...options, ...lastArgument})

    return array;
}

function getLastArgument(array){
    return array[array.length-1];
}

function surchage(){
    let surchageArguments = {
        requestArguments: Object.values(arguments),
        callbacks: {}
    }

    switch(surchageArguments.requestArguments.length){
        case 1: 
            break;
        case 2:
            const objectKeys = Object.keys(surchageArguments.requestArguments[1])
            if(['data', 'end', 'error', 'callback'].filter((key) => objectKeys.includes(key)).length > 0 || objectKeys.length == 0)
                surchageArguments.callbacks = surchageArguments.requestArguments.pop();
            break;
        case 3:
            surchageArguments.callbacks = surchageArguments.requestArguments.pop();
            break;
        default:
            throw Error(`Three or less arguments expected but ${surchageArguments.requestArguments.length} given`)
    }

    return surchageArguments
}