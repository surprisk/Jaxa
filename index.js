import https from "https";
import http from "http";

const protocols = { https, http };

export function Jaxa(){

    let argumentsArray = Object.values(arguments)
    let callbacks = {};
    const protocol = typeof argumentsArray[0] == "string" ? 
        new URL(argumentsArray[0]).protocol.slice(0, -1) :
        argumentsArray[0].protocol.slice(0, -1);

    switch(argumentsArray.length){
        case 1: 
            if(typeof argumentsArray[0] == "string")
                argumentsArray.push({method: 'GET'})
        break;
        case 2:
            const objectKeys = Object.keys(argumentsArray[1])
            if(['data', 'end', 'error'].filter((key) => objectKeys.includes(key)).length > 0)
                callbacks = argumentsArray.pop();
        break;
        case 3:
            callbacks = argumentsArray.pop();
        break;
        default:
            throw Error(`Three or less arguments expected but ${argumentsArray.length} given`)
    }

    if(!protocols[protocol])
        throw Error('Wrong protocol');

    const item = this;

    console.log(argumentsArray)

    return new Promise(
        (resolve, reject) => {
        protocols[protocol].request(...argumentsArray, (res) => {
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