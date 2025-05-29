# n8n-nodes-zoho

[![GitHub Release](https://img.shields.io/github/v/release/vladaman/n8n-nodes-zoho)](https://github.com/vladaman/n8n-nodes-zoho/releases)
[![GitHub issues](https://img.shields.io/github/issues/vladaman/n8n-nodes-zoho)](https://github.com/vladaman/n8n-nodes-zoho/issues)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://opensource.org/licenses/GPL-3.0)

> Universal Zoho credentials integration for n8n workflows.

## Features

- OAuth2 credential type for Zoho API (`Zoho API`)
- Supports multiple Zoho regional domains (US, EU, IN, AU, CN)
- Automatic token refresh via n8n's built-in OAuth2 support

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

After installation, restart n8n to load the new credential type.

## Usage

1. In n8n, go to **Settings > API Credentials**.
2. Click **New Credentials** and select **Zoho API**.
3. Provide your Zoho **Client ID** and **Client Secret**, then choose the appropriate regional endpoints:

   | Setting               | Option                                      |
   | --------------------- | ------------------------------------------- |
   | Authorization URL     | `https://accounts.zoho.com/oauth/v2/auth` (US/EU/IN/AU)<br>`https://accounts.zoho.com.cn/oauth/v2/auth` (CN) |
   | Access Token URL      | `https://accounts.zoho.com/oauth/v2/token` (US)<br>`https://accounts.zoho.eu/oauth/v2/token` (EU)<br>`https://accounts.zoho.in/oauth/v2/token` (IN)<br>`https://accounts.zoho.com.au/oauth/v2/token` (AU)<br>`https://accounts.zoho.com.cn/oauth/v2/token` (CN) |
   | Scope                 | Comma-separated list of Zoho API scopes (e.g., `ZohoCRM.modules.ALL,ZohoCRM.settings.all`) |
   | Auth URI Query Params | Additional query params (default: `access_type=offline`) |

4. Click **Connect** and complete the OAuth2 flow in your browser.

Once configured, select **Zoho API** credentials in any node that supports OAuth2 (for example, the **HTTP Request** node) to interact with Zoho endpoints.

### Example: Fetching CRM Leads

Configure an **HTTP Request** node:

- **Authentication**: OAuth2
- **OAuth2 Credential**: Zoho API
- **Method**: GET
- **URL**: `https://www.zohoapis.com/crm/v2/Leads`

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