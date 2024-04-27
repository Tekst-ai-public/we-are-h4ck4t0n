export default class FacebookClient {
  private _accessToken: string;
  private _graphApiVersion: string;

  constructor(accessToken: string, graphApiVersion: string = "19.0") {
    this._accessToken = accessToken;
    this._graphApiVersion = graphApiVersion;
  }

    public async getUserInfo(): Promise<any> {
        
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/me`, 'GET');

        return response;
    }
    async fetch<T>(
        url: string, 
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', 
        body?: any, 
        queryParams?: any,
        token?: string
    ): Promise<T> {
        try {
            let endpoint = url;
            const headers: HeadersInit = new Headers();
            console.log(token);

            // Build query string from queryParams if they exist.
            if (queryParams) {
                const queryString = new URLSearchParams(queryParams).toString();
                endpoint += `?${queryString}`;
            }

            // Safely encode the access token
            if (this._accessToken) {
                endpoint += (endpoint.includes('?') ? '&' : '?') + `access_token=${encodeURIComponent(token?token:this._accessToken)}`;
            }

            const fetchOptions: RequestInit = {
                method: method,
                headers: headers,
            };

            // Set headers and body for POST and PATCH methods
            if ((method === 'POST' || method === 'PATCH') && body) {
                headers.set('Content-Type', 'application/json');
                fetchOptions.body = JSON.stringify(body);
            }
            const response = await fetch(endpoint, fetchOptions);

            // Check if the HTTP response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json() as Promise<T>;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    public async getPages(): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/me/accounts`, 'GET');
        return response;
    }

    public async getPageById(id: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}`, 'GET');
        return response;
    }

    public async getPostsByPage(id: string,token?: string): Promise<any> {
        console.log(`token is ${token}`);
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}/posts`, 'GET',undefined,undefined,token);
        return response;
    }

    public async getPostById(id: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}`, 'GET');
        return response;
    }

    public async getCommentsByPost(id: string,accessToken?: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}/comments`, 'GET',undefined,undefined,accessToken);
        return response;
    }

    public async getCommentById(id: string): Promise<any> {
        const response = await this.fetch(`https://graph.facebook.com/v${this._graphApiVersion}/${id}`, 'GET');
        return response;
    }

}
