import type {
    IExecuteFunctions,
    IHookFunctions,
    IDataObject,
    ILoadOptionsFunctions,
    JsonObject,
    IHttpRequestMethods,
    IRequestOptions,
} from 'n8n-workflow';
import {NodeApiError, NodeOperationError} from 'n8n-workflow';

import type {
    ZohoOAuth2ApiCredentials,
} from './types';

export function throwOnErrorStatus(
    this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
    responseData: {
        data?: Array<{ status: string; message: string }>;
    },
) {
    if (responseData?.data?.[0].status === 'error') {
        throw new NodeOperationError(this.getNode(), responseData as Error);
    }
}

export async function zohoApiRequest(
    this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    uri: string,
    body: IDataObject = {},
    qs: IDataObject = {}
) {
    const {oauthTokenData} = await this.getCredentials<ZohoOAuth2ApiCredentials>('zohoApi');

    console.log('Using token ', oauthTokenData);

    // Determine the request URL: use provided URI if absolute, else prefix with api_domain
    const requestUrl = uri.match(/^https?:\/\//)
        ? uri
        : `${oauthTokenData.api_domain}${uri}`;

    const options: IRequestOptions = {
        body: {
            data: [body],
        },
        method,
        qs,
        uri: requestUrl,
        headers: {
            Authorization: 'Zoho-oauthtoken ' + oauthTokenData.access_token,
        },
        json: true,
    };

    console.log('opts', options);

    if (!Object.keys(body).length) {
        delete options.body;
    }

    if (!Object.keys(qs).length) {
        delete options.qs;
    }

    try {
        const responseData = await this.helpers.requestOAuth2?.call(this, 'zohoApi', options);
        if (responseData === undefined) return [];
        throwOnErrorStatus.call(this, responseData as IDataObject);

        return responseData;
    } catch (error) {
        const args = error.cause?.data
            ? {
                message: error.cause.data.message || 'The Zoho API returned an error.',
                description: JSON.stringify(error.cause.data, null, 2),
            }
            : undefined;
        throw new NodeApiError(this.getNode(), error as JsonObject, args);
    }
}

/**
 * Make an authenticated API request to Zoho CRM API and return all items.
 */
export async function zohoApiRequestAllItems(
    this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
) {
    const returnData: IDataObject[] = [];

    let responseData;
    qs.per_page = 200;
    qs.page = 1;

    do {
        responseData = await zohoApiRequest.call(this, method, endpoint, body, qs);
        if (Array.isArray(responseData) && !responseData.length) return returnData;
        returnData.push(...(responseData.data as IDataObject[]));
        qs.page++;
    } while (responseData.info.more_records !== undefined && responseData.info.more_records === true);

    return returnData;
}
