import {
    type IExecuteFunctions,
    type IDataObject,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
    NodeConnectionType,
    NodeOperationError,
} from 'n8n-workflow';

import {zohoSubscriptionsApiRequest} from './GenericFunctions';

export class ZohoBilling implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Zoho Billing',
        name: 'zohoBilling',
        icon: 'file:zoho.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["method"] + ": " + $parameter["path"]}}',
        description: 'Consume Zoho Billing (Subscriptions) API',
        defaults: {
            name: 'Zoho Billing',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'zohoApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Organization ID',
                name: 'organizationId',
                type: 'string',
                required: true,
                default: '',
                description: 'Zoho Subscriptions organization ID',
            },
            {
                displayName: 'Method',
                name: 'method',
                type: 'options',
                options: [
                    {name: 'GET', value: 'GET'},
                    {name: 'POST', value: 'POST'},
                    {name: 'PUT', value: 'PUT'},
                    {name: 'DELETE', value: 'DELETE'},
                ],
                default: 'GET',
                description: 'HTTP method to use',
            },
            {
                displayName: 'Path',
                name: 'path',
                type: 'string',
                default: '/api/v1/',
                required: true,
                description: 'Endpoint path, e.g. /api/v1/customers',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const baseURL = 'https://www.zohoapis.eu/billing/v1';

        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        for (let i = 0; i < items.length; i++) {
            const method = this.getNodeParameter('method', i) as string;
            const path = this.getNodeParameter('path', i) as string;
            const queryParameters = this.getNodeParameter('queryParameters', i) as string;
            const bodyParameters = this.getNodeParameter('bodyParameters', i) as string;

            let qs: IDataObject = {};
            if (queryParameters) {
                try {
                    qs = JSON.parse(queryParameters) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'Query Parameters must be valid JSON');
                }
            }
            let body: IDataObject = {};
            if (bodyParameters) {
                try {
                    body = JSON.parse(bodyParameters) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'Body Parameters must be valid JSON');
                }
            }
            const orgId = this.getNodeParameter('organizationId', i) as string;
            const responseData = await zohoSubscriptionsApiRequest.call(this, method, baseURL, path, body, qs, orgId);
            if (Array.isArray(responseData)) {
                returnData.push(...responseData as IDataObject[]);
            } else {
                returnData.push(responseData as IDataObject);
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
