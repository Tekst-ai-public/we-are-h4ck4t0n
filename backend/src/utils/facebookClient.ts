export default class FacebookClient {
    private _accessToken: string;
    private _graphApiVersion: string;

    constructor(accessToken: string, graphApiVersion: string) {
        this._accessToken = accessToken;
        this._graphApiVersion = graphApiVersion;
    }

    public async getUserInfo(): Promise<any> {
        const headers = { 
            'Authorization': `Bearer ${this._accessToken}`
        }
        const response = await fetch(`https://graph.facebook.com/v${this._graphApiVersion}/me`, {
            method: 'GET',
            headers: headers
        });
        const data = await response.json();

        return data;
    }




}