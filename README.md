# n8n-nodes-zoho

[![GitHub Release](https://img.shields.io/github/v/release/vladaman/n8n-nodes-zoho)](https://github.com/vladaman/n8n-nodes-zoho/releases)
[![GitHub issues](https://img.shields.io/github/issues/vladaman/n8n-nodes-zoho)](https://github.com/vladaman/n8n-nodes-zoho/issues)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://opensource.org/licenses/GPL-3.0)

> Zoho API credentials and custom nodes for n8n workflows.

## Features

- OAuth2 credential type for Zoho API (`Zoho API`)
- Custom nodes for Zoho Sheets, Zoho Tasks, and Zoho Billing (Subscriptions)
- Supports multiple Zoho regional domains (US, EU, IN, AU, CN)
- Automatic token refresh via n8n's built-in OAuth2 support

## Nodes

- **Zoho Sheets**: create and manage spreadsheets (create workbooks, list workbooks, add records to worksheets).
- **Zoho Tasks**: manage tasks and projects via Zoho Tasks API (add, list, get, update, delete tasks and projects).
- **Zoho Billing**: interact with Zoho Subscriptions API for billing data (custom GET/POST/PUT/DELETE operations).

## Installation

Use one of the following methods to install and enable the Zoho API credentials in your n8n instance:

```bash
# Option 1: Install via npm
npm install n8n-nodes-zoho

# Option 2: Clone into your custom nodes directory
git clone https://github.com/vladaman/n8n-nodes-zoho.git ~/.n8n/custom/n8n-nodes-zoho
cd ~/.n8n/custom/n8n-nodes-zoho
npm install
npm run build
```

After installation, restart n8n to load the new credential type and nodes.

## Usage

### 1. Set up Zoho API credentials

1. In n8n, go to **Settings > API Credentials**.
2. Click **New Credentials** and select **Zoho API**.
3. Enter your Zoho **Client ID** and **Client Secret**, then choose the appropriate regional endpoints:

   | Setting               | Option                                      |
   | --------------------- | ------------------------------------------- |
   | Authorization URL     | `https://accounts.zoho.com/oauth/v2/auth` (US/EU/IN/AU)<br>`https://accounts.zoho.com.cn/oauth/v2/auth` (CN) |
   | Access Token URL      | `https://accounts.zoho.com/oauth/v2/token` (US)<br>`https://accounts.zoho.eu/oauth/v2/token` (EU)<br>`https://accounts.zoho.in/oauth/v2/token` (IN)<br>`https://accounts.zoho.com.au/oauth/v2/token` (AU)<br>`https://accounts.zoho.com.cn/oauth/v2/token` (CN) |
   | Scope                 | Comma-separated list of Zoho API scopes (e.g., `ZohoCRM.modules.ALL,ZohoCRM.settings.all`) |
   | Auth URI Query Params | Additional query params (default: `access_type=offline`) |

4. Click **Connect** and complete the OAuth2 flow in your browser.

### 2. Use the Zoho nodes in your workflow

After installing and configuring your Zoho API credentials, add any of the provided Zoho nodes to your workflow and select your **Zoho API** credential.

#### Example: Create a new Zoho Sheets workbook

1. Add a **Zoho Sheets** node.
2. Set **Operation** to **Create Workbook**.
3. Enter the desired **Workbook Name**.
4. Execute the workflow to receive the new workbook's details.

#### Example: List your Zoho Tasks

1. Add a **Zoho Tasks** node.
2. Set **Operation** to **Get All Personal Tasks** (or another desired operation).
3. Execute the workflow to retrieve your tasks.

#### Example: Call Zoho Billing API

1. Add a **Zoho Billing** node.
2. Specify your **Organization ID**, HTTP **Method**, and **Path** (e.g., `/api/v1/customers`).
3. Execute the workflow to interact with the Zoho Subscriptions API.

## Development

This project is written in TypeScript. To build and test locally:

```bash
git clone https://github.com/vladaman/n8n-nodes-zoho.git
cd n8n-nodes-zoho
npm install
npm run build
# (Optional) Run tests
npm test
```

## Contributing

Contributions and feedback are welcome! Please open issues and pull requests on GitHub:

https://github.com/vladaman/n8n-nodes-zoho/issues

## License

This project is licensed under the [GPL-3.0 License](https://opensource.org/licenses/GPL-3.0).