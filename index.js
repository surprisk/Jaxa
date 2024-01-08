import https from "https";
import http from "http";

const protocols = { https, http };

export function Jaxa(url, callbacks = {}, options = {method: 'GET'}){
    const item = this;
    const protocol = new URL(url).protocol.slice(0, -1);

    if(!protocols[protocol])
        throw Error('Wrong protocol');

    return new Promise(
        (resolve, reject) => {
        protocols[protocol].request(url, options, (res) => {
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