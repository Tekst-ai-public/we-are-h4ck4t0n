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
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/me`, 'GET');

        return response;
    }
    async fetch(url: string, method: string, body?: any, queryParams?: any): Promise<any> {
        let query = '';
        if (queryParams) {
            query = new URLSearchParams(queryParams).toString();
        }
        const response = await fetch(`${url}?access_token=${this._accessToken}${query?`&${query}`:''}`, {
            method: method,
            body: body
        });
        const data = await response.json();
        return data;
    }

    public async getPages(): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/me/accounts`, 'GET');
        return response;
    }

    public async getPageById(id: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}`, 'GET');
        return response;
    }

    public async getPostsByPage(id: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}/posts`, 'GET');
        return response;
    }

    public async getPostById(id: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}`, 'GET');
        return response;
    }

    public async getCommentsByPost(id: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}/comments`, 'GET');
        return response;
    }

    public async getCommentById(id: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}`, 'GET');
        return response;
    }




}