import {
    type IDataObject,
    type IExecuteFunctions,
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
                    {name: 'Product', value: 'product', description: 'Operations on products'},
                    {name: 'Plan', value: 'plan', description: 'Operations on plans'},
                    {name: 'Add-on', value: 'addon', description: 'Operations on add-ons'},
                    {name: 'Subscription', value: 'subscription', description: 'Operations on subscriptions'},
                    {name: 'Invoice', value: 'invoice', description: 'Operations on invoices'},
                    {name: 'Payment', value: 'payment', description: 'Operations on payments'},
                    {name: 'Customer', value: 'customer', description: 'Operations on customers'},
                    {name: 'Event', value: 'event', description: 'Operations on events'},
                    {name: 'Item', value: 'item', description: 'Operations on items'},
                ],
                default: 'product',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['product']},
                },
                options: [
                    {name: 'List', value: 'listProducts', description: 'List all products'},
                    {name: 'Get', value: 'getProduct', description: 'Get a product'},
                    {name: 'Create', value: 'createProduct', description: 'Create a product'},
                    {name: 'Update', value: 'updateProduct', description: 'Update a product'},
                    {name: 'Delete', value: 'deleteProduct', description: 'Delete a product'},
                ],
                default: 'listProducts',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['plan']},
                },
                options: [
                    {name: 'List', value: 'listPlans', description: 'List all plans'},
                    {name: 'Get', value: 'getPlan', description: 'Get a plan'},
                    {name: 'Create', value: 'createPlan', description: 'Create a plan'},
                    {name: 'Update', value: 'updatePlan', description: 'Update a plan'},
                    {name: 'Delete', value: 'deletePlan', description: 'Delete a plan'},
                ],
                default: 'listPlans',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['addon']},
                },
                options: [
                    {name: 'List', value: 'listAddons', description: 'List all add-ons'},
                    {name: 'Get', value: 'getAddon', description: 'Get an add-on'},
                    {name: 'Create', value: 'createAddon', description: 'Create an add-on'},
                    {name: 'Update', value: 'updateAddon', description: 'Update an add-on'},
                    {name: 'Delete', value: 'deleteAddon', description: 'Delete an add-on'},
                ],
                default: 'listAddons',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['subscription']},
                },
                options: [
                    {name: 'List', value: 'listSubscriptions', description: 'List all subscriptions'},
                    {name: 'Get', value: 'getSubscription', description: 'Get a subscription'},
                    {name: 'Create', value: 'createSubscription', description: 'Create a subscription'},
                    {name: 'Update', value: 'updateSubscription', description: 'Update a subscription'},
                    {name: 'Cancel', value: 'cancelSubscription', description: 'Cancel a subscription'},
                ],
                default: 'listSubscriptions',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['invoice']},
                },
                options: [
                    {name: 'List', value: 'listInvoices', description: 'List all invoices'},
                    {name: 'Get', value: 'getInvoice', description: 'Get an invoice'},
                    {name: 'Create', value: 'createInvoice', description: 'Create an invoice'},
                    {name: 'Update', value: 'updateInvoice', description: 'Update an invoice'},
                    {name: 'Delete', value: 'deleteInvoice', description: 'Delete an invoice'},
                ],
                default: 'listInvoices',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['payment']},
                },
                options: [
                    {name: 'List', value: 'listPayments', description: 'List all payments'},
                    {name: 'Get', value: 'getPayment', description: 'Get a payment'},
                    {name: 'Create', value: 'createPayment', description: 'Create a payment'},
                ],
                default: 'listPayments',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['customer']},
                },
                options: [
                    {name: 'List', value: 'listCustomers', description: 'List all customers'},
                    {name: 'Get', value: 'getCustomer', description: 'Retrieve details of a customer'},
                    {
                        name: 'Get By Reference',
                        value: 'getCustomerByReference',
                        description: 'Get a customer by reference ID'
                    },
                    {name: 'Unused Credits', value: 'getUnusedCredits', description: 'Unused Credits of a Customer'},
                    {name: 'List Transactions', value: 'listTransactions', description: 'List all transactions'},
                    {name: 'List Comments', value: 'listCustomerComments', description: 'List Customer comments'},
                    {name: 'Create', value: 'createCustomer', description: 'Create a customer'},
                    {
                        name: 'Enable Reminders',
                        value: 'enableAllReminders',
                        description: 'Enable all reminders for a customer'
                    },
                    {
                        name: 'Stop Reminders',
                        value: 'stopAllReminders',
                        description: 'Stop all reminders for a customer'
                    },
                    {name: 'Mark as Active', value: 'markCustomerAsActive', description: 'Mark a customer as active'},
                    {
                        name: 'Mark as Inactive',
                        value: 'markCustomerAsInactive',
                        description: 'Mark a customer as inactive'
                    },
                    {
                        name: 'Bulk Mark as Active',
                        value: 'bulkMarkCustomersAsActive',
                        description: 'Bulk mark customers as active'
                    },
                    {
                        name: 'Bulk Mark as Inactive',
                        value: 'bulkMarkCustomersAsInactive',
                        description: 'Bulk mark customers as inactive'
                    },
                    {name: 'Update', value: 'updateCustomer', description: 'Update a customer'},
                    {name: 'Delete Comment', value: 'deleteCustomerComment', description: 'Delete a customer comment'},
                    {name: 'Delete Address', value: 'deleteCustomerAddress', description: 'Delete a customer address'},
                    {name: 'Delete', value: 'deleteCustomer', description: 'Delete a customer'},
                    {name: 'Bulk Delete', value: 'bulkDeleteCustomers', description: 'Bulk delete customers'},
                ],
                default: 'listCustomers',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['event']},
                },
                options: [
                    {name: 'List', value: 'listEvents', description: 'List all events'},
                    {name: 'Get', value: 'getEvent', description: 'Get an event'},
                ],
                default: 'listEvents',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {resource: ['item']},
                },
                options: [
                    {name: 'List', value: 'listItems', description: 'List all items'},
                    {name: 'Get', value: 'getItem', description: 'Get an item'},
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
                        operation: ['getProduct', 'updateProduct', 'deleteProduct'],
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
                        operation: ['getPlan', 'updatePlan', 'deletePlan'],
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
                        operation: ['getAddon', 'updateAddon', 'deleteAddon'],
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
                displayName: 'Filters',
                name: 'filters',
                type: 'fixedCollection',
                default: {filter: []},
                typeOptions: {
                    multipleValues: true,
                },
                placeholder: 'Add Filter',
                displayOptions: {
                    show: {
                        resource: ['subscription'],
                        operation: ['listSubscriptions'],
                    },
                },
                options: [
                    {
                        displayName: 'Filter',
                        name: 'filter',
                        values: [
                            {
                                displayName: 'Field Name',
                                name: 'filterBy',
                                type: 'options',
                                options: [
                                    {name: 'Search Text', value: 'search_text'},
                                    {name: 'Subscription Number Contains', value: 'subscription_number_contains'},
                                    {name: 'Reference Contains', value: 'reference_contains'},
                                    {name: 'Subscription Status', value: 'filter_by'},
                                ],
                                default: 'search_text',
                                description: 'Field to filter by',
                            },
                            {
                                displayName: 'Value',
                                name: 'filterValue',
                                type: 'string',
                                default: '',
                                description: 'Value to filter the selected field by',
                                displayOptions: {
                                    show: {
                                        filterBy: [
                                            'search_text',
                                            'subscription_number_contains',
                                            'reference_contains',
                                        ],
                                    },
                                },
                            },
                            {
                                displayName: 'Subscription Status',
                                name: 'filterValue',
                                type: 'options',
                                options: [
                                    {name: 'All', value: 'SubscriptionStatus.All'},
                                    {name: 'In Progress', value: 'SubscriptionStatus.IN_PROGRESS'},
                                    {name: 'Trial', value: 'SubscriptionStatus.TRIAL'},
                                    {name: 'Future', value: 'SubscriptionStatus.FUTURE'},
                                    {name: 'Live', value: 'SubscriptionStatus.LIVE'},
                                    {name: 'Unpaid', value: 'SubscriptionStatus.UNPAID'},
                                    {name: 'Past Due', value: 'SubscriptionStatus.PAST_DUE'},
                                    {name: 'Non‑Renewing', value: 'SubscriptionStatus.NON_RENEWING'},
                                    {name: 'Cancelled', value: 'SubscriptionStatus.CANCELLED'},
                                    {
                                        name: 'Cancelled From Dunning',
                                        value: 'SubscriptionStatus.CANCELLED_FROM_DUNNING'
                                    },
                                    {name: 'Expired', value: 'SubscriptionStatus.EXPIRED'},
                                    {name: 'Creation Failed', value: 'SubscriptionStatus.CREATION_FAILED'},
                                    {name: 'Trial Expired', value: 'SubscriptionStatus.TRIAL_EXPIRED'},
                                    {name: 'Cancelled This Month', value: 'SubscriptionStatus.CANCELLED_THIS_MONTH'},
                                    {name: 'Cancelled Last Month', value: 'SubscriptionStatus.CANCELLED_LAST_MONTH'},
                                    {name: 'Paused', value: 'SubscriptionStatus.PAUSED'},
                                    {name: 'Having Unbilled', value: 'SubscriptionStatus.HAVING_UNBILLED'},
                                ],
                                default: 'SubscriptionStatus.All',
                                description: 'Subscription status to filter by',
                                displayOptions: {
                                    show: {
                                        filterBy: ['filter_by'],
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'Page',
                name: 'page',
                type: 'number',
                typeOptions: {minValue: 1},
                default: 1,
                description: 'Page number to retrieve',
                displayOptions: {
                    show: {
                        resource: ['subscription'],
                        operation: ['listSubscriptions'],
                    },
                },
            },
            {
                displayName: 'Per Page',
                name: 'perPage',
                type: 'number',
                typeOptions: {minValue: 1, maxValue: 200},
                default: 200,
                description: 'Number of records per page',
                displayOptions: {
                    show: {
                        resource: ['subscription'],
                        operation: ['listSubscriptions'],
                    },
                },
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
                displayName: 'Page',
                name: 'page',
                type: 'number',
                typeOptions: {minValue: 1},
                default: 1,
                description: 'Page number to retrieve',
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: ['listCustomers'],
                    },
                },
            },
            {
                displayName: 'Per Page',
                name: 'perPage',
                type: 'number',
                typeOptions: {minValue: 1, maxValue: 200},
                default: 200,
                description: 'Number of records per page',
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: ['listCustomers'],
                    },
                },
            },
            {
                displayName: 'Filters',
                name: 'filters',
                type: 'fixedCollection',
                default: {filter: []},
                typeOptions: {multipleValues: true},
                placeholder: 'Add Filter',
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: ['listCustomers'],
                    },
                },
                options: [
                    {
                        displayName: 'Filter',
                        name: 'filter',
                        values: [
                            {
                                displayName: 'Field Name',
                                name: 'filterBy',
                                type: 'options',
                                options: [
                                    {name: 'Contact Number Contains', value: 'contact_number_contains'},
                                    {name: 'Email Contains', value: 'email_contains'},
                                    {name: 'Status', value: 'status'},
                                    {name: 'Custom Field Contains', value: 'custom_field'},
                                ],
                                default: 'contact_number_contains',
                                description: 'Field to filter customers by',
                            },
                            {
                                displayName: 'Value',
                                name: 'filterValue',
                                type: 'string',
                                default: '',
                                description: 'Value to filter by',
                                displayOptions: {
                                    show: {filterBy: ['contact_number_contains', 'email_contains', 'custom_field']},
                                },
                            },
                            {
                                displayName: 'Status',
                                name: 'filterValue',
                                type: 'options',
                                options: [
                                    {name: 'Active', value: 'active'},
                                    {name: 'Inactive', value: 'inactive'},
                                ],
                                default: 'active',
                                description: 'Customer status to filter by',
                                displayOptions: {
                                    show: {
                                        filterBy: ['status'],
                                    },
                                },
                            },
                            {
                                displayName: 'Custom Field ID',
                                name: 'customFieldId',
                                type: 'string',
                                default: '',
                                displayOptions: {
                                    show: {filterBy: ['custom_field']},
                                },
                                description: 'Custom field number to use for custom field filter',
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'Page',
                name: 'page',
                type: 'number',
                typeOptions: {minValue: 1},
                default: 1,
                description: 'Page number to retrieve',
                displayOptions: {
                    show: {
                        resource: ['invoice'],
                        operation: ['listInvoices'],
                    },
                },
            },
            {
                displayName: 'Per Page',
                name: 'perPage',
                type: 'number',
                typeOptions: {minValue: 1, maxValue: 200},
                default: 200,
                description: 'Number of records per page',
                displayOptions: {
                    show: {
                        resource: ['invoice'],
                        operation: ['listInvoices'],
                    },
                },
            },
            {
                displayName: 'Page',
                name: 'page',
                type: 'number',
                typeOptions: {minValue: 1},
                default: 1,
                description: 'Page number to retrieve',
                displayOptions: {
                    show: {
                        resource: ['payment'],
                        operation: ['listPayments'],
                    },
                },
            },
            {
                displayName: 'Per Page',
                name: 'perPage',
                type: 'number',
                typeOptions: {minValue: 1, maxValue: 200},
                default: 200,
                description: 'Number of records per page',
                displayOptions: {
                    show: {
                        resource: ['payment'],
                        operation: ['listPayments'],
                    },
                },
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
                displayName: 'Reference Type',
                name: 'referenceIdType',
                type: 'options',
                default: 'zcrm_account_id',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['customer'],
                        operation: ['getCustomerByReference'],
                    },
                },
                options: [
                    {
                        name: 'Account ID',
                        value: 'zcrm_account_id',
                        description: 'For accounts only and Accounts and its contacts sync'
                    },
                    {name: 'Contact ID', value: 'zcrm_contact_id', description: 'For Contacts only sync'},
                ],
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
                type: 'json',
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
                    {name: 'All', value: 'All'},
                    {name: 'Sent', value: 'Sent'},
                    {name: 'Draft', value: 'Draft'},
                    {name: 'Overdue', value: 'OverDue'},
                    {name: 'Paid', value: 'Paid'},
                    {name: 'Partially Paid', value: 'PartiallyPaid'},
                    {name: 'Void', value: 'Void'},
                    {name: 'Unpaid', value: 'Unpaid'},
                ],
                default: 'All',
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
        const baseURL = 'https://www.zohoapis.eu/billing/v1';
        console.log('execute');
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i) as string;
            const orgId = this.getNodeParameter('organizationId', i) as string;
            if (operation === 'listProducts') { // <-- Correctly checks for 'listProducts'
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/products`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getProduct') {
                const productId = this.getNodeParameter('productId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/products/${productId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'createProduct') {
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/products`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'updateProduct') {
                const productId = this.getNodeParameter('productId', i) as string;
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'PUT', `${baseURL}/products/${productId}`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'deleteProduct') {
                const productId = this.getNodeParameter('productId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/products/${productId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listPlans') {
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/plans`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getPlan') {
                const planId = this.getNodeParameter('planId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/plans/${planId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'createPlan') {
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/plans`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'updatePlan') {
                const planId = this.getNodeParameter('planId', i) as string;
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'PUT', `${baseURL}/plans/${planId}`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'deletePlan') {
                const planId = this.getNodeParameter('planId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/plans/${planId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listAddons') {
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/addons`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getAddon') {
                const addonId = this.getNodeParameter('addonId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/addons/${addonId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'createAddon') {
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/addons`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'updateAddon') {
                const addonId = this.getNodeParameter('addonId', i) as string;
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'PUT', `${baseURL}/addons/${addonId}`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'deleteAddon') {
                const addonId = this.getNodeParameter('addonId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/addons/${addonId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
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
                if (filterBy && filterBy !== 'All') {
                    qs.filter_by = filterBy;
                }
                const page = this.getNodeParameter('page', i) as number;
                const perPage = this.getNodeParameter('perPage', i) as number;
                if (page) {
                    qs.page = page;
                }
                if (perPage) {
                    qs.per_page = perPage;
                }

                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/invoices`, {}, qs, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listSubscriptions') {
                // build optional filters and paging parameters
                const filters = this.getNodeParameter('filters', i, {filter: []}) as {
                    filter?: Array<{ filterBy: string; filterValue: string }>;
                };
                const page = this.getNodeParameter('page', i) as number;
                const perPage = this.getNodeParameter('perPage', i) as number;
                const qs: IDataObject = {};
                if (filters.filter) {
                    for (const f of filters.filter) {
                        if (f.filterValue) {
                            qs[f.filterBy] = f.filterValue;
                        }
                    }
                }
                if (page) {
                    qs.page = page;
                }
                if (perPage) {
                    qs.per_page = perPage;
                }
                const responseData = await zohoSubscriptionsApiRequest.call(
                    this,
                    'GET',
                    `${baseURL}/subscriptions`,
                    {},
                    qs,
                    orgId,
                );
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getSubscription') {
                const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/subscriptions/${subscriptionId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'createSubscription') {
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/subscriptions`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'updateSubscription') {
                const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'PUT', `${baseURL}/subscriptions/${subscriptionId}`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'cancelSubscription') {
                const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/subscriptions/${subscriptionId}/cancel`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getInvoice') {
                const invoiceId = this.getNodeParameter('invoiceId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/invoices/${invoiceId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'deleteInvoice') {
                const invoiceId = this.getNodeParameter('invoiceId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/invoices/${invoiceId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'createInvoice') {
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/invoices`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'createPayment') {
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/payments`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getPayment') {
                const paymentId = this.getNodeParameter('paymentId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/payments/${paymentId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listPayments') {
                const page = this.getNodeParameter('page', i) as number;
                const perPage = this.getNodeParameter('perPage', i) as number;
                const qs: IDataObject = {};
                if (page) {
                    qs.page = page;
                }
                if (perPage) {
                    qs.per_page = perPage;
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/payments`, {}, qs, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listEvents') {
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/events`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getEvent') {
                const eventId = this.getNodeParameter('eventId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/events/${eventId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listItems') {
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/items`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getItem') {
                const itemId = this.getNodeParameter('itemId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/items/${itemId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getCustomerByReference') {
                const referenceId = this.getNodeParameter('referenceId', i) as string;
                const referenceIdType = this.getNodeParameter('referenceIdType', i) as string;
                const qs = {
                    reference_id_type: referenceIdType
                } as IDataObject;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers/reference/${referenceId}`, {}, qs, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listCustomers') {
                const page = this.getNodeParameter('page', i) as number;
                const perPage = this.getNodeParameter('perPage', i) as number;
                const qs: IDataObject = {};
                if (page) {
                    qs.page = page;
                }
                if (perPage) {
                    qs.per_page = perPage;
                }


                // Apply any customer filters (contact number, email, custom field)
                const filters = this.getNodeParameter('filters', i, {filter: []}) as {
                    filter?: Array<{ filterBy: string; filterValue: string; customFieldId?: string }>;
                };
                if (filters.filter) {
                    for (const f of filters.filter) {
                        if (!f.filterValue) {
                            continue;
                        }
                        if (f.filterBy === 'custom_field') {
                            if (f.customFieldId) {
                                qs[`custom_field_${f.customFieldId}_contains`] = f.filterValue;
                            }
                        } else {
                            qs[f.filterBy] = f.filterValue;
                        }
                    }
                }

                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers`, {}, qs, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getCustomer') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers/${customerId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'getUnusedCredits') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers/${customerId}/unusedcredits`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listTransactions') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const qs: IDataObject = {customer_id: customerId};
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/transactions`, {}, qs, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'listCustomerComments') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'GET', `${baseURL}/customers/${customerId}/comments`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'createCustomer') {
                const jsonData = this.getNodeParameter('jsonData', i) as string;
                let body: IDataObject;
                try {
                    body = JSON.parse(jsonData) as IDataObject;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'JSON Data must be valid JSON');
                }
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers`, body, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'enableAllReminders') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/${customerId}/paymentreminder/enable`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'stopAllReminders') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/${customerId}/paymentreminder/disable`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'markCustomerAsActive') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/${customerId}/markasactive`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'markCustomerAsInactive') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/${customerId}/markasinactive`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'bulkMarkCustomersAsActive') {
                const customerIds = this.getNodeParameter('customerIds', i) as string;
                const qs: IDataObject = {customer_ids: customerIds};
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/markasactive`, {}, qs, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'bulkMarkCustomersAsInactive') {
                const customerIds = this.getNodeParameter('customerIds', i) as string;
                const qs: IDataObject = {customer_ids: customerIds};
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'POST', `${baseURL}/customers/markasinactive`, {}, qs, orgId);
                returnData.push({json: responseData as IDataObject});
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
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'deleteCustomerComment') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const commentId = this.getNodeParameter('commentId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/customers/${customerId}/comments/${commentId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'deleteCustomerAddress') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const addressId = this.getNodeParameter('addressId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/customers/${customerId}/address/${addressId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'deleteCustomer') {
                const customerId = this.getNodeParameter('customerId', i) as string;
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/customers/${customerId}`, {}, {}, orgId);
                returnData.push({json: responseData as IDataObject});
            } else if (operation === 'bulkDeleteCustomers') {
                const customerIds = this.getNodeParameter('customerIds', i) as string;
                const qs: IDataObject = {customer_ids: customerIds};
                const responseData = await zohoSubscriptionsApiRequest.call(this, 'DELETE', `${baseURL}/customers`, {}, qs, orgId);
                returnData.push({json: responseData as IDataObject});
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
                returnData.push({json: responseData as IDataObject});
            } else {
                console.error(`Unhandled operation ${operation}`); // shows list
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
