export default class FacebookClient {
  private _accessToken: string;
  private _graphApiVersion: string;

  constructor(accessToken: string, graphApiVersion: string = "19.0") {
    this._accessToken = accessToken;
    this._graphApiVersion = graphApiVersion;
  }

  public async getUserInfo(): Promise<{ name: string, id: string }> {
    const response = await fetch(`https://graph.facebook.com/v${this._graphApiVersion}/me?access_token=${this._accessToken}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("failed to fetch user details")
    }

    return data;
  }

}
