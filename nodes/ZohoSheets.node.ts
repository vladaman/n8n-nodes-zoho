import {
    type IExecuteFunctions,
    type IDataObject,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
    NodeConnectionType, // must be NodeConnectionType, not NodeConnectionTypes !
    NodeOperationError,
} from 'n8n-workflow';

import {zohoApiRequest} from './GenericFunctions';

export class ZohoSheets implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Zoho Sheets',
        name: 'zohoSheets',
        icon: 'file:zoho.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Consume Zoho Sheet API',
        defaults: {
            name: 'Zoho Sheet',
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
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Create Workbook',
                        value: 'create',
                    },
                    {
                        name: 'List Workbooks',
                        value: 'list',
                    },
                    {
                        name: 'Add Records to Worksheet',
                        value: 'addRecords',
                    },
                ],
                default: 'create',
            },
            {
                displayName: 'Workbook Name',
                name: 'workbookName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['create'],
                    },
                },
                description: 'Name of the workbook to create',
            },
            {
                displayName: 'Start Index',
                name: 'startIndex',
                type: 'number',
                default: 1,
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                description: 'Start index for pagination',
            },
            {
                displayName: 'Count',
                name: 'count',
                type: 'number',
                default: 1000,
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                description: 'Number of records to return',
            },
            {
                displayName: 'Sort Option',
                name: 'sortOption',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                description: 'Sort option (e.g. recently_modified)',
            },
            {
                displayName: 'Workbook Resource ID',
                name: 'resourceId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['addRecords'],
                    },
                },
                description: 'ID of the workbook to modify',
            },
            {
                displayName: 'Worksheet Name',
                name: 'worksheetName',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['addRecords'],
                    },
                },
                description: 'Name of the worksheet to add records to (required if worksheetId not set)',
            },
            {
                displayName: 'Worksheet ID',
                name: 'worksheetId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['addRecords'],
                    },
                },
                description: 'ID of the worksheet to add records to (required if worksheetName not set)',
            },
            {
                displayName: 'Header Row',
                name: 'headerRow',
                type: 'number',
                default: 1,
                displayOptions: {
                    show: {
                        operation: ['addRecords'],
                    },
                },
                description: 'Header row index (default is 1)',
            },
            {
                displayName: 'JSON Data',
                name: 'jsonData',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['addRecords'],
                    },
                },
                description: 'JSON array string of records to add',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        const operation = this.getNodeParameter('operation', 0) as string;

        const baseURL = 'https://sheet.zoho.eu/api/v2';

        for (let i = 0; i < items.length; i++) {
            if (operation === 'create') {
                const workbookName = this.getNodeParameter('workbookName', i) as string;
                const qs: IDataObject = {
                    method: 'workbook.create',
                    workbook_name: workbookName,
                };
                // endpoint is https://sheet.zoho.eu/api/v2/create
                const responseData = await zohoApiRequest.call(this, 'POST', baseURL, '/create', null, qs);
                returnData.push({json: JSON.parse(responseData)});
            } else if (operation === 'list') {
                const sortOption = this.getNodeParameter('sortOption', i) as string;
                const qs: IDataObject = {
                    method: 'workbook.list',
                    start_index: this.getNodeParameter('startIndex', i) as number || 1,
                    count: this.getNodeParameter('count', i) as number || 1000
                };
                if (sortOption) {
                    qs.sort_option = sortOption;
                }
                // endpoint is https://sheet.zoho.eu/api/v2/workbooks
                const responseData = await zohoApiRequest.call(this, 'POST', baseURL, '/workbooks', null, qs);
                returnData.push({json: JSON.parse(responseData)});
            } else if (operation === 'addRecords') {
                const resourceId = this.getNodeParameter('resourceId', i) as string;
                const worksheetName = this.getNodeParameter('worksheetName', i) as string;
                const worksheetId = this.getNodeParameter('worksheetId', i) as string;
                const headerRow = this.getNodeParameter('headerRow', i) as number;
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                if (!worksheetName && !worksheetId) {
                    throw new NodeOperationError(this.getNode(), 'Please specify either worksheetName or worksheetId');
                }
                const qs: IDataObject = {
                    method: 'worksheet.records.add',
                    json_data: jsonData,
                    header_row: headerRow,
                };
                if (worksheetName) {
                    qs.worksheet_name = worksheetName;
                } else {
                    qs.worksheet_id = worksheetId;
                }
                // endpoint is https://sheet.zoho.eu/api/v2/{$resource_id}
                const responseData = await zohoApiRequest.call(this, 'POST', baseURL, `/${resourceId}`, null, qs);
                returnData.push({json: JSON.parse(responseData)});
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
