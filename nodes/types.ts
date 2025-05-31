export type ZohoOAuth2ApiCredentials = {
    authUrl: string;
    accessTokenUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    authQueryParameters: string;
    authentication: string;
    redirectUri: string;
    oauthTokenData: {
        api_domain: string;
        access_token: string;
        refresh_token: string;
        expires_in: number; // Default 3600 seconds
    };
};