import https from "https";
import http from "http";

const protocols = { https, http };

export default class Jaxa{
    constructor(){
        
    }

    request(){
        const item = this;
        const { requestArguments, callbacks } = surchage(...arguments);
        const options = getLastArgument(requestArguments);

        const protocol = typeof requestArguments[0] == "string" ? 
            new URL(requestArguments[0]).protocol.slice(0, -1) :
            requestArguments[0].protocol.slice(0, -1);
    
        if(!protocols[protocol])
            throw Error('Wrong protocol');
    
        return new Promise(
            (resolve, reject) => {
            const req = protocols[protocol].request(...requestArguments, callbacks.callback ? (res) => callbacks.callback.apply(item, [res, resolve, reject])  : (res) => {
                let data = '';
    
                res
                .on('data', (chunk) => {
                    callbacks.data ?
                        callbacks.data.apply(item, [chunk, data]) :
                        data += chunk;
                })
                .on('end', () => {
                    resolve(callbacks.end ? callbacks.end.apply(item, [data]) : data);
                })
                .on('error', (err) => {
                    reject(callbacks.error ? callbacks.error.apply(item, [err]) : err);
                })
    
            })
            .on("error", (err) => {
                console.log(err)
            })

            if(options.body)
                req.write(options.body)
            
            req.end();
        });
    }

    get(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'GET'), callbacks);
    }

    post(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'POST'), callbacks);
    }

    put(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'PUT'), callbacks);
    }

    delete(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'DELETE'), callbacks);
    }

    connect(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'CONNECT'), callbacks);
    }

    options(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'OPTIONS'), callbacks);
    }

    trace(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'TRACE'), callbacks);
    }

    patch(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'PATCH'), callbacks);
    }

    head(){
        const { requestArguments, callbacks } = surchage(...arguments);

        return this.request(...overrideMethod(requestArguments, 'HEAD'), callbacks);
    }

}

function overrideMethod(array, method){
    const lastArgument = getLastArgument(array);

    typeof lastArgument == 'string' ?
        array.push({method}) :
        lastArgument.method = method

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
            if(typeof surchageArguments.requestArguments[0] == "string")
                surchageArguments.requestArguments.push({method: 'GET'})
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