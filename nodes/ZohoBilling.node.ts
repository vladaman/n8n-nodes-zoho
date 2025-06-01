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
        subtitle: '={{$parameter["operation"]}}',
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
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'Product', value: 'product', description: 'Operations on products' },
                    { name: 'Plan', value: 'plan', description: 'Operations on plans' },
                    { name: 'Add-on', value: 'addon', description: 'Operations on add-ons' },
                    { name: 'Subscription', value: 'subscription', description: 'Operations on subscriptions' },
                    { name: 'Invoice', value: 'invoice', description: 'Operations on invoices' },
                    { name: 'Payment', value: 'payment', description: 'Operations on payments' },
                    { name: 'Customer', value: 'customer', description: 'Operations on customers' },
                    { name: 'Event', value: 'event', description: 'Operations on events' },
                    { name: 'Item', value: 'item', description: 'Operations on items' },
                ],
                default: 'product',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                show: { resource: ['product'] },
                },
                options: [
                    { name: 'List', value: 'listProducts', description: 'List all products' },
                    { name: 'Get', value: 'getProduct', description: 'Get a product' },
                    { name: 'Create', value: 'createProduct', description: 'Create a product' },
                    { name: 'Update', value: 'updateProduct', description: 'Update a product' },
                    { name: 'Delete', value: 'deleteProduct', description: 'Delete a product' },
                ],
                default: 'listProducts',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                show: { resource: ['plan'] },
                },
                options: [
                    { name: 'List', value: 'listPlans', description: 'List all plans' },
                    { name: 'Get', value: 'getPlan', description: 'Get a plan' },
                    { name: 'Create', value: 'createPlan', description: 'Create a plan' },
                    { name: 'Update', value: 'updatePlan', description: 'Update a plan' },
                    { name: 'Delete', value: 'deletePlan', description: 'Delete a plan' },
                ],
                default: 'listPlans',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                show: { resource: ['addon'] },
                },
                options: [
                    { name: 'List', value: 'listAddons', description: 'List all add-ons' },
                    { name: 'Get', value: 'getAddon', description: 'Get an add-on' },
                    { name: 'Create', value: 'createAddon', description: 'Create an add-on' },
                    { name: 'Update', value: 'updateAddon', description: 'Update an add-on' },
                    { name: 'Delete', value: 'deleteAddon', description: 'Delete an add-on' },
                ],
                default: 'listAddons',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                show: { resource: ['subscription'] },
                },
                options: [
                    { name: 'List', value: 'listSubscriptions', description: 'List all subscriptions' },
                    { name: 'Get', value: 'getSubscription', description: 'Get a subscription' },
                    { name: 'Create', value: 'createSubscription', description: 'Create a subscription' },
                    { name: 'Update', value: 'updateSubscription', description: 'Update a subscription' },
                    { name: 'Cancel', value: 'cancelSubscription', description: 'Cancel a subscription' },
                ],
                default: 'listSubscriptions',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                show: { resource: ['invoice'] },
                },
                options: [
                    { name: 'List', value: 'listInvoices', description: 'List all invoices' },
                    { name: 'Get', value: 'getInvoice', description: 'Get an invoice' },
                    { name: 'Create', value: 'createInvoice', description: 'Create an invoice' },
                    { name: 'Update', value: 'updateInvoice', description: 'Update an invoice' },
                    { name: 'Delete', value: 'deleteInvoice', description: 'Delete an invoice' },
                ],
                default: 'listInvoices',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                show: { resource: ['payment'] },
                },
                options: [
                    { name: 'List', value: 'listPayments', description: 'List all payments' },
                    { name: 'Get', value: 'getPayment', description: 'Get a payment' },
                    { name: 'Create', value: 'createPayment', description: 'Create a payment' },
                ],
                default: 'listPayments',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: { resource: ['customer'] },
                },
                options: [
                    { name: 'List', value: 'listCustomers', description: 'List all customers' },
                    { name: 'Get', value: 'getCustomer', description: 'Retrieve details of a customer' },
                    { name: 'Get By Reference', value: 'getCustomerByReference', description: 'Get a customer by reference ID' },
                    { name: 'Unused Credits', value: 'getUnusedCredits', description: 'Unused Credits of a Customer' },
                    { name: 'List Transactions', value: 'listTransactions', description: 'List all transactions' },
                    { name: 'List Comments', value: 'listCustomerComments', description: 'List Customer comments' },
                    { name: 'Create', value: 'createCustomer', description: 'Create a customer' },
                    { name: 'Enable Reminders', value: 'enableAllReminders', description: 'Enable all reminders for a customer' },
                    { name: 'Stop Reminders', value: 'stopAllReminders', description: 'Stop all reminders for a customer' },
                    { name: 'Mark as Active', value: 'markCustomerAsActive', description: 'Mark a customer as active' },
                    { name: 'Mark as Inactive', value: 'markCustomerAsInactive', description: 'Mark a customer as inactive' },
                    { name: 'Bulk Mark as Active', value: 'bulkMarkCustomersAsActive', description: 'Bulk mark customers as active' },
                    { name: 'Bulk Mark as Inactive', value: 'bulkMarkCustomersAsInactive', description: 'Bulk mark customers as inactive' },
                    { name: 'Update', value: 'updateCustomer', description: 'Update a customer' },
                    { name: 'Delete Comment', value: 'deleteCustomerComment', description: 'Delete a customer comment' },
                    { name: 'Delete Address', value: 'deleteCustomerAddress', description: 'Delete a customer address' },
                    { name: 'Delete', value: 'deleteCustomer', description: 'Delete a customer' },
                    { name: 'Bulk Delete', value: 'bulkDeleteCustomers', description: 'Bulk delete customers' },
                ],
                default: 'listCustomers',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                show: { resource: ['event'] },
                },
                options: [
                    { name: 'List', value: 'listEvents', description: 'List all events' },
                    { name: 'Get', value: 'getEvent', description: 'Get an event' },
                ],
                default: 'listEvents',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                show: { resource: ['item'] },
                },
                options: [
                    { name: 'List', value: 'listItems', description: 'List all items' },
                    { name: 'Get', value: 'getItem', description: 'Get an item' },
                ],
                default: 'listItems',
            },
            {
                displayName: 'Organization ID',
                name: 'organizationId',
                type: 'string',
                required: true,
                default: '',
                description: 'Zoho Subscriptions organization ID',
            },
            {
                displayName: 'Product ID',
                name: 'productId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['product'],
                        operation: ['get', 'update', 'delete'],
                    },
                },
                description: 'ID of the product',
            },
            {
                displayName: 'Plan ID',
                name: 'planId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['plan'],
                        operation: ['get', 'update', 'delete'],
                    },
                },
                description: 'ID of the plan',
            },
            {
                displayName: 'Add-on ID',
                name: 'addonId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['addon'],
                        operation: ['get', 'update', 'delete'],
                    },
                },
                description: 'ID of the add-on',
            },
            {
                displayName: 'Subscription ID',
                name: 'subscriptionId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['subscription'],
                        operation: ['getSubscription', 'updateSubscription', 'cancelSubscription'],
                    },
                },
                description: 'ID of the subscription',
            },
            {
                displayName: 'Invoice ID',
                name: 'invoiceId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['invoice'],
                        operation: ['getInvoice', 'updateInvoice', 'deleteInvoice'],
                    },
                },
                description: 'ID of the invoice',
            },
            {
                displayName: 'Payment ID',
                name: 'paymentId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['payment'],
                        operation: ['getPayment'],
                    },
                },
                description: 'ID of the payment',
            },
            {
                displayName: 'Customer ID',
                name: 'customerId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: [
                            'getCustomer',
                            'getUnusedCredits',
                            'listTransactions',
                            'listCustomerComments',
                            'enableAllReminders',
                            'stopAllReminders',
                            'markCustomerAsActive',
                            'markCustomerAsInactive',
                            'updateCustomer',
                            'deleteCustomer',
                            'deleteCustomerComment',
                            'deleteCustomerAddress',
                        ],
                    },
                },
                description: 'CRM customer ID',
            },
            {
                displayName: 'Reference ID',
                name: 'referenceId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: ['getCustomerByReference'],
                    },
                },
                description: 'CRM reference ID of the customer',
            },
            {
                displayName: 'Comment ID',
                name: 'commentId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: ['deleteCustomerComment'],
                    },
                },
                description: 'ID of the comment to delete',
            },
            {
                displayName: 'Address ID',
                name: 'addressId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: ['deleteCustomerAddress'],
                    },
                },
                description: 'ID of the address to delete',
            },
            {
                displayName: 'Customer IDs',
                name: 'customerIds',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: ['bulkMarkCustomersAsActive', 'bulkMarkCustomersAsInactive', 'bulkDeleteCustomers'],
                    },
                },
                description: 'Comma-separated list of customer IDs',
            },
            {
                displayName: 'Event ID',
                name: 'eventId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['event'],
                        operation: ['getEvent'],
                    },
                },
                description: 'ID of the event',
            },
            {
                displayName: 'Item ID',
                name: 'itemId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['item'],
                        operation: ['getItem'],
                    },
                },
                description: 'ID of the item',
            },
            {
                displayName: 'JSON Data',
                name: 'jsonData',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['product', 'plan', 'addon', 'subscription', 'invoice', 'payment', 'customer', 'item'],
                        operation: [
                            'createProduct', 'updateProduct',
                            'createPlan', 'updatePlan',
                            'createAddon', 'updateAddon',
                            'createSubscription', 'updateSubscription',
                            'createInvoice', 'updateInvoice',
                            'createPayment',
                            'createCustomer', 'updateCustomer',
                        ],
                    },
                },
                description: 'Raw JSON string for the request body',
            },
            {
                displayName: 'Subscription ID',
                name: 'subscriptionId',
                type: 'string',
                default: '',
                required: false,
                displayOptions: {
                    show: {
                        resource: ['invoice'],
                        operation: ['listInvoices'],
                    },
                },
                description: 'Filter by subscription ID to list invoices for a specific subscription',
            },
            {
                displayName: 'Customer ID',
                name: 'customerId',
                type: 'string',
                default: '',
                required: false,
                displayOptions: {
                    show: {
                        resource: ['invoice'],
                        operation: ['listInvoices'],
                    },
                },
                description: 'Filter by customer ID to list invoices for a specific customer',
            },
            {
                displayName: 'Filter By',
                name: 'filterBy',
                type: 'options',
                options: [
                    { name: 'All', value: 'All' },
                    { name: 'Sent', value: 'Sent' },
                    { name: 'Draft', value: 'Draft' },
                    { name: 'Overdue', value: 'OverDue' },
                    { name: 'Paid', value: 'Paid' },
                    { name: 'Partially Paid', value: 'PartiallyPaid' },
                    { name: 'Void', value: 'Void' },
                    { name: 'Unpaid', value: 'Unpaid' },
                ],
                default: '',
                displayOptions: {
                    show: {
                        resource: ['invoice'],
                        operation: ['listInvoices'],
                    },
                },
                description: 'Filter by invoice status',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const baseURL = 'https://subscriptions.zoho.eu/api/v1';

	const items = this.getInputData();
	const returnData: IDataObject[] = [];
	for (let i = 0; i < items.length; i++) {
		const operation = this.getNodeParameter('operation', i) as string;
		const orgId = this.getNodeParameter('organizationId', i) as string;
		if (operation === 'listProducts') {
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/products`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listPlans') {
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/plans`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listAddons') {
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/addons`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listInvoices') {
			const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
			const customerId = this.getNodeParameter('customerId', i) as string;
			const filterBy = this.getNodeParameter('filterBy', i) as string;
			const qs: IDataObject = {};
			if (subscriptionId) {
				qs.subscription_id = subscriptionId;
			}
			if (customerId) {
				qs.customer_id = customerId;
			}
			if (filterBy) {
				qs.filter_by = filterBy;
			}
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/invoices`, {}, qs, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listSubscriptions') {
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/subscriptions`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'getInvoice') {
			const invoiceId = this.getNodeParameter('invoiceId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/invoices/${invoiceId}`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'createInvoice') {
			const jsonData = this.getNodeParameter('jsonData', i) as string;
			let body: IDataObject;
			try {
				body = JSON.parse(jsonData) as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
			}
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/invoices`, body, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'createPayment') {
			const jsonData = this.getNodeParameter('jsonData', i) as string;
			let body: IDataObject;
			try {
				body = JSON.parse(jsonData) as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
			}
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/payments`, body, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'getPayment') {
			const paymentId = this.getNodeParameter('paymentId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/payments/${paymentId}`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listEvents') {
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/events`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listItems') {
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/items`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'getCustomerByReference') {
			const referenceId = this.getNodeParameter('referenceId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers/reference/${referenceId}`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listCustomers') {
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'getCustomer') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers/${customerId}`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'getUnusedCredits') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers/${customerId}/unusedcredits`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listTransactions') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const qs: IDataObject = { customer_id: customerId };
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/transactions`, {}, qs, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'listCustomerComments') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers/${customerId}/comments`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'createCustomer') {
			const jsonData = this.getNodeParameter('jsonData', i) as string;
			let body: IDataObject;
			try {
				body = JSON.parse(jsonData) as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
			}
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers`, body, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'enableAllReminders') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/${customerId}/paymentreminder/enable`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'stopAllReminders') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/${customerId}/paymentreminder/disable`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'markCustomerAsActive') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/${customerId}/markasactive`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'markCustomerAsInactive') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/${customerId}/markasinactive`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'bulkMarkCustomersAsActive') {
			const customerIds = this.getNodeParameter('customerIds', i) as string;
			const qs: IDataObject = { customer_ids: customerIds };
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/markasactive`, {}, qs, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'bulkMarkCustomersAsInactive') {
			const customerIds = this.getNodeParameter('customerIds', i) as string;
			const qs: IDataObject = { customer_ids: customerIds };
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/markasinactive`, {}, qs, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'updateCustomer') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const jsonData = this.getNodeParameter('jsonData', i) as string;
			let body: IDataObject;
			try {
				body = JSON.parse(jsonData) as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
			}
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'PUT', `${baseURL}/customers/${customerId}`, body, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'deleteCustomerComment') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const commentId = this.getNodeParameter('commentId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/customers/${customerId}/comments/${commentId}`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'deleteCustomerAddress') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const addressId = this.getNodeParameter('addressId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/customers/${customerId}/address/${addressId}`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'deleteCustomer') {
			const customerId = this.getNodeParameter('customerId', i) as string;
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/customers/${customerId}`, {}, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'bulkDeleteCustomers') {
			const customerIds = this.getNodeParameter('customerIds', i) as string;
			const qs: IDataObject = { customer_ids: customerIds };
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/customers`, {}, qs, orgId);
			returnData.push({ json: responseData as IDataObject });
		} else if (operation === 'updateInvoice') {
			const invoiceId = this.getNodeParameter('invoiceId', i) as string;
			const jsonData = this.getNodeParameter('jsonData', i) as string;
			let body: IDataObject;
			try {
				body = JSON.parse(jsonData) as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
			}
			const responseData = await zohoSubscriptionsApiRequest.call(this, 'PUT', `${baseURL}/invoices/${invoiceId}`, body, {}, orgId);
			returnData.push({ json: responseData as IDataObject });
		}else{
            console.error(`Unhandled operation ${operation}`); // shows list
        }
	}

	return [this.helpers.returnJsonArray(returnData)];
    }
}
