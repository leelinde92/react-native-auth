import axios from 'axios';
import TokenManager from "./TokenManager";

export default class Authentication
{

    constructor(url)
    {
        this.url = url;
        this.tokens = new TokenManager();
    }

    async authenticate(client_id, client_secret, username, password, scope = '')
    {
        await axios.post(`${this.url}/oauth/token`, {
            grant_type: `password`,
            client_id,
            client_secret,
            username,
            password,
            scope
        })
            .then(response => {
                this.tokens.save(
                    response.access_token,
                    response.refresh_token
                );
            });
    }

    async validate()
    {
        await axios.get(`${this.url}/oauth/clients`, {
            headers: {
                'Authorization': `Bearer ${this.tokens.access}`
            }
        })
            .then(() => { return true })
            .catch(() => { return false });
    }

    async refresh(scope = '')
    {
        await axios.get(`${this.url}/oauth/token`, {
            grant_type: `refresh_token`,
            refresh_token: this.tokens.refresh,
            client_id,
            client_secret,
            scope
        })
            .then(response => {
                this.tokens.save(
                    response.access_token,
                    response.refresh_token
                );
            });
    }

}