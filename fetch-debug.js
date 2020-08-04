module.exports = () => {
    const originFetch = global.fetch;
    global.fetch = (...args) => {
        const [url, params] = args;
        return originFetch(...args).then((response) => {
            if (typeof response.json === "function" && response.status === 200) {
                return response.json().then((json) => {
                    console.log(`----  FETCH ${params.method || "get"} ${url}`);
//                     console.log(`Stack
// ${new Error().stack}`);
                    console.log(`JSON RESPONSE 
${JSON.stringify(json, null, 2)}`);
                    console.log(
                        `----  FETCH END ${params.method || "get"} ${url}`
                    );
                    return {
                        ...response,
                        json() {
                            return Promise.resolve(json);
                        },
                    };
                });
            }
            return response.text().then((text) => {
                console.log(`----  FETCH RESPONSE ${params.method || "get"} ${response.status} ${url}`);
                console.log(text);
                return {
                    ...response,
                    text() {
                        return Promise.resolve(text);
                    },
                };
            });
        });
    };
};
