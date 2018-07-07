import { SecureStore } from 'expo';

export const NAME_ACCESS_TOKEN = "ACCESS_TOKEN";
export const NAME_REFRESH_TOKEN = "REFRESH_TOKEN";

export default class TokenManager
{

    access = null;
    refresh = null;

    constructor()
    {
        this.access = SecureStore.getItemAsync(NAME_ACCESS_TOKEN);
        this.refresh = SecureStore.getItemAsync(NAME_REFRESH_TOKEN);
    }

    save(token, refresh)
    {
        SecureStore.setItemAsync(NAME_ACCESS_TOKEN, token);
        SecureStore.setItemAsync(NAME_REFRESH_TOKEN, refresh);

        this.access = token;
        this.refresh = refresh;
    }

}