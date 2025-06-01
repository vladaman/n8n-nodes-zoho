import {
    type IExecuteFunctions,
    type IDataObject,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
    NodeConnectionType,
} from 'n8n-workflow';

import { zohoApiRequest } from './GenericFunctions';

export class ZohoEmail implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Zoho Email',
        name: 'zohoEmail',
        icon: 'file:zoho.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Consume Zoho Mail API to send emails and schedule email automations',
        defaults: {
            name: 'Zoho Email',
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
                        name: 'Send Email',
                        value: 'sendEmail',
                    },
                ],
                default: 'sendEmail',
            },
            {
                displayName: 'Account ID',
                name: 'accountId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Zoho Mail account ID from which to send the email',
            },
            {
                displayName: 'From Address',
                name: 'fromAddress',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: "Sender's email address associated with the account",
            },
            {
                displayName: 'To Address',
                name: 'toAddress',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: "Recipient's email address",
            },
            {
                displayName: 'CC Address',
                name: 'ccAddress',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Cc email address(es), comma-separated if multiple',
            },
            {
                displayName: 'BCC Address',
                name: 'bccAddress',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Bcc email address(es), comma-separated if multiple',
            },
            {
                displayName: 'Subject',
                name: 'subject',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Email subject',
            },
            {
                displayName: 'Content',
                name: 'content',
                type: 'string',
                typeOptions: {
                    rows: 5,
                },
                default: '',
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Email body/content',
            },
            {
                displayName: 'Mail Format',
                name: 'mailFormat',
                type: 'options',
                options: [
                    { name: 'HTML', value: 'html' },
                    { name: 'Plain Text', value: 'plaintext' },
                ],
                default: 'html',
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Format of the email content',
            },
            {
                displayName: 'Ask Receipt',
                name: 'askReceipt',
                type: 'options',
                options: [
                    { name: 'Yes', value: 'yes' },
                    { name: 'No', value: 'no' },
                ],
                default: 'no',
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Whether to request a Read receipt',
            },
            {
                displayName: 'Encoding',
                name: 'encoding',
                type: 'options',
                options: [
                    { name: 'Big5', value: 'Big5' },
                    { name: 'EUC-JP', value: 'EUC-JP' },
                    { name: 'EUC-KR', value: 'EUC-KR' },
                    { name: 'GB2312', value: 'GB2312' },
                    { name: 'ISO-2022-JP', value: 'ISO-2022-JP' },
                    { name: 'ISO-8859-1', value: 'ISO-8859-1' },
                    { name: 'KOI8-R', value: 'KOI8-R' },
                    { name: 'Shift_JIS', value: 'Shift_JIS' },
                    { name: 'US-ASCII', value: 'US-ASCII' },
                    { name: 'UTF-8', value: 'UTF-8' },
                    { name: 'WINDOWS-1251', value: 'WINDOWS-1251' },
                    { name: 'X-WINDOWS-ISO2022JP', value: 'X-WINDOWS-ISO2022JP' },
                ],
                default: 'UTF-8',
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Encoding for the email content',
            },
            {
                displayName: 'Is Schedule',
                name: 'isSchedule',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                    },
                },
                description: 'Whether to schedule sending the email',
            },
            {
                displayName: 'Schedule Type',
                name: 'scheduleType',
                type: 'options',
                options: [
                    { name: 'After 1 Hour', value: 1 },
                    { name: 'After 2 Hours', value: 2 },
                    { name: 'After 4 Hours', value: 3 },
                    { name: 'Next Day Morning', value: 4 },
                    { name: 'Next Day Afternoon', value: 5 },
                    { name: 'Custom Date & Time', value: 6 },
                ],
                default: 1,
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                        isSchedule: [true],
                    },
                },
                description: 'Scheduling option',
            },
            {
                displayName: 'Time Zone',
                name: 'timeZone',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                        isSchedule: [true],
                        scheduleType: [6],
                    },
                },
                description: 'Time zone for custom schedule (e.g., GMT 5:30)',
            },
            {
                displayName: 'Schedule Time',
                name: 'scheduleTime',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['sendEmail'],
                        isSchedule: [true],
                        scheduleType: [6],
                    },
                },
                description: 'Custom date and time (MM/DD/YYYY HH:MM:SS) for scheduled sending',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        const operation = this.getNodeParameter('operation', 0) as string;
        const baseURL = 'https://mail.zoho.com/api';

        for (let i = 0; i < items.length; i++) {
            if (operation === 'sendEmail') {
                const accountId = this.getNodeParameter('accountId', i) as string;
                const fromAddress = this.getNodeParameter('fromAddress', i) as string;
                const toAddress = this.getNodeParameter('toAddress', i) as string;
                const ccAddress = this.getNodeParameter('ccAddress', i) as string;
                const bccAddress = this.getNodeParameter('bccAddress', i) as string;
                const subject = this.getNodeParameter('subject', i) as string;
                const content = this.getNodeParameter('content', i) as string;
                const mailFormat = this.getNodeParameter('mailFormat', i) as string;
                const askReceipt = this.getNodeParameter('askReceipt', i) as string;
                const encoding = this.getNodeParameter('encoding', i) as string;
                const isSchedule = this.getNodeParameter('isSchedule', i) as boolean;
                const scheduleType = this.getNodeParameter('scheduleType', i) as number;
                const timeZone = this.getNodeParameter('timeZone', i) as string;
                const scheduleTime = this.getNodeParameter('scheduleTime', i) as string;

                const body: IDataObject = {
                    fromAddress,
                    toAddress,
                    subject,
                    content,
                    mailFormat,
                    askReceipt,
                };
                if (ccAddress) {
                    body.ccAddress = ccAddress;
                }
                if (bccAddress) {
                    body.bccAddress = bccAddress;
                }
                if (encoding) {
                    body.encoding = encoding;
                }
                if (isSchedule) {
                    body.isSchedule = true;
                    body.scheduleType = scheduleType;
                    if (scheduleType === 6) {
                        body.timeZone = timeZone;
                        body.scheduleTime = scheduleTime;
                    }
                }

                const endpoint = `/accounts/${accountId}/messages`;
                const responseData = await zohoApiRequest.call(
                    this,
                    'POST',
                    baseURL,
                    endpoint,
                    body,
                );
                returnData.push(responseData as IDataObject);
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
