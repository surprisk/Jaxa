import https from "https";
import http from "http";

const protocols = { https, http };

export default class Jaxa{
    constructor(){
        
    }

    request(){
        const { requestArguments, callbacks } = surchage(...arguments);

        const protocol = typeof requestArguments[0] == "string" ? 
            new URL(requestArguments[0]).protocol.slice(0, -1) :
            requestArguments[0].protocol.slice(0, -1);
    
        if(!protocols[protocol])
            throw Error('Wrong protocol');
    
        const item = this;
    
        return new Promise(
            (resolve, reject) => {
            protocols[protocol].request(...requestArguments, (res) => {
                let data = '';
    
                res
                .on('data', (chunk) => {
                    data += callbacks.data ? callbacks.data.apply(item, [chunk]) : chunk;
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
            .end();
        });
    }

    get(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'GET';

        return this.request(...requestArguments, callbacks);
    }

    post(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'POST';

        return this.request(...requestArguments, callbacks);
    }

    put(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'PUT';

        return this.request(...requestArguments, callbacks);
    }

    delete(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'DELETE';

        return this.request(...requestArguments, callbacks);
    }

    connect(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'CONNECT';

        return this.request(...requestArguments, callbacks);
    }

    options(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'OPTIONS';

        return this.request(...requestArguments, callbacks);
    }

    trace(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'TRACE';

        return this.request(...requestArguments, callbacks);
    }

    patch(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'PATCH';

        return this.request(...requestArguments, callbacks);
    }

    head(){
        const { requestArguments, callbacks } = surchage(...arguments);

        requestArguments[requestArguments.length-1].method = 'HEAD';

        return this.request(...requestArguments, callbacks);
    }

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
            if(['data', 'end', 'error'].filter((key) => objectKeys.includes(key)).length > 0 || objectKeys.length == 0)
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