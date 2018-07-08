import axios from 'axios';
import TokenManager from "./TokenManager";

export default class Authentication
{

    source = null;

    constructor(url)
    {
        this.url = url;
        this.tokens = new TokenManager();
    }

    async authenticate(auth)
    {
        let { client_id, client_secret, username, password, scope = '' } = auth;
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        return await axios.post(`${this.url}/oauth/token`, {
                grant_type: `password`,
                client_id,
                client_secret,
                username,
                password,
                scope
            },
            {
                cancelToken: this.source.token
            })
            .then(response => {
                let { data } = response;
                this.tokens.save(
                    data.access_token,
                    data.refresh_token
                );

                return Promise.resolve(data);
            });
    }

    async refresh(token, scope = '')
    {
        await axios.get(`${this.url}/oauth/token`, {
            grant_type: `refresh_token`,
            refresh_token: token,
            client_id,
            client_secret,
            scope
        })
            .then(response => {
                let { data } = response;
                this.tokens.save(
                    data.access_token,
                    data.refresh_token
                );

                return Promise.resolve(true);
            })
            .catch(() => Promise.resolve(false));
    }

    async logout()
    {

    }

    cancel()
    {
        if(this.source !== null)
        {
            this.source.cancel("Stopping authentication.");
        }
    }

}