const baseUrl = 'http://localhost:8088/';
const accessToken = 'eMpuZVQHp4pHuRNKUC2EcGkyeQs-PfEf';

const get = (url, queryParams, headerOptions) => {
    url = baseUrl + url + '?' + new URLSearchParams({
        'access-token': accessToken,
        ...queryParams
    });

    return fetch(url, headerOptions)
        .then(res => {
            if (!res.ok) {
                return Promise.reject('Status is not 200');
            }

            return res.json();
        })
        .catch(error => {
            console.error('HTTP call error:', error);
            return { error: 'HTTP call error occured' };
        });
}

const post = (url, body, queryParams, headerOptions) => {
    url = baseUrl + url + '?' + new URLSearchParams({
        'access-token': accessToken,
        ...queryParams
    });

    const formData = new FormData();
    for (let key in body) {
        formData.append(key, body[key]);
    }

    const opt = {
        method: 'POST',
        headers: headerOptions,
        body: formData,
    };

    return fetch(url, opt)
        .then(res => res.json())
        .catch(error => {
            console.error('HTTP call error:', error);
            return { error: 'HTTP call error occured' };
        });
}

const httpService = {
    get: get,
    post: post
}

export default httpService;
