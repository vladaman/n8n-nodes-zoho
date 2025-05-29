import {
   type IExecuteFunctions,
   type IDataObject,
   type INodeExecutionData,
   type INodeType,
   type INodeTypeDescription,
   NodeConnectionTypes,
} from 'n8n-workflow';

import { zohoApiRequest } from './GenericFunctions';

export class Zoho implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Sheet',
		name: 'zohoSheet',
		icon: 'file:zoho.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Consume Zoho Sheet API',
		defaults: {
			name: 'Zoho Sheet',
		},
			inputs: [NodeConnectionTypes.Main],
			outputs: [NodeConnectionTypes.Main],
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			if (operation === 'create') {
				const workbookName = this.getNodeParameter('workbookName', i) as string;
				const body: IDataObject = {
					method: 'workbook.create',
					workbook_name: workbookName,
				};
				const responseData = await zohoApiRequest.call(this, 'POST', '/api/v2/create', body);
				returnData.push(responseData as IDataObject);
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
