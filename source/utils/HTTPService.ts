import { HTTPClient } from 'koajax';

const baseUri = {
    local: 'http://localhost:3000',
    remote: 'https://vuqjf9paihid.leanapp.cn',
    test: 'https://vsw505fxbitp.leanapp.cn/'
};

export const httpService = new HTTPClient({
    baseURI: 'https://vsw505fxbitp.leanapp.cn',
    withCredentials: true,
    responseType: 'json'
});
