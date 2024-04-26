export default class FacebookClient {
    private static _instance: FacebookClient;
    private _accessToken: string;
    private _graphApiVersion: string;

    constructor(accessToken: string, graphApiVersion: string) {
        this._accessToken = accessToken;
        this._graphApiVersion = graphApiVersion;
    }

    public static getInstance(accessToken: string, graphApiVersion: string): FacebookClient {
        if (!FacebookClient._instance) {
            FacebookClient._instance = new FacebookClient(accessToken, graphApiVersion);
        }

        return FacebookClient._instance;
    }

    public async getUserInfo(): Promise<any> {
        const response = await fetch(`https://graph.facebook.com/v${this._graphApiVersion}/me?access_token=${this._accessToken}`);
        const data = await response.json();

        return data;
    }
}