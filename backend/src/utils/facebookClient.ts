export default class FacebookClient {
    private _accessToken: string;
    private _graphApiVersion: string;

    constructor(accessToken: string, graphApiVersion: string) {
        this._accessToken = accessToken;
        this._graphApiVersion = graphApiVersion;
    }

    public async getUserInfo(): Promise<any> {
        const response = await fetch(`https://graph.facebook.com/v${this._graphApiVersion}/me?access_token=${this._accessToken}`);
        const data = await response.json();

        return data;
    }


}