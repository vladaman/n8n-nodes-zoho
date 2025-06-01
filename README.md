# n8n-nodes-zoho

[![GitHub Release](https://img.shields.io/github/v/release/vladaman/n8n-nodes-zoho)](https://github.com/vladaman/n8n-nodes-zoho/releases)
[![GitHub issues](https://img.shields.io/github/issues/vladaman/n8n-nodes-zoho)](https://github.com/vladaman/n8n-nodes-zoho/issues)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://opensource.org/licenses/GPL-3.0)

> Comprehensive Zoho API integration for n8n workflows with OAuth2 authentication and multiple service support.

## Features

- **OAuth2 Authentication**: Secure credential management with automatic token refresh
- **Multi-Regional Support**: Works with Zoho services across US, EU, IN, AU, and CN regions
- **Comprehensive API Coverage**: Four specialized nodes covering major Zoho services
- **TypeScript Implementation**: Full type safety and modern development practices
- **n8n Native Integration**: Seamless integration with n8n's workflow ecosystem

## Available Nodes

### 🗂️ Zoho Sheets
Complete spreadsheet management capabilities:
- Create and list workbooks
- Add records to worksheets with JSON data support
- Header row configuration and flexible data input

### ✅ Zoho Tasks
Full task and project management:
- **Personal Tasks**: Create, retrieve, update, and delete personal tasks
- **Group Tasks**: Manage tasks within team groups
- **Project Management**: Create and manage projects with task assignments
- **Subtask Support**: Handle hierarchical task structures
- **Advanced Features**: Priority management, status updates, due dates, reminders, and recurring tasks

### 💰 Zoho Billing (Subscriptions)
Comprehensive billing and subscription management:
- **Products & Plans**: CRUD operations for products and subscription plans
- **Subscriptions**: Create, update, cancel, and manage subscriptions
- **Customers**: Complete customer lifecycle management including bulk operations
- **Invoices**: Invoice creation, updates, and status filtering
- **Payments**: Payment processing and tracking
- **Add-ons & Items**: Manage additional services and items
- **Events**: Access billing events and transaction history

### 📧 Zoho Email
Advanced email automation:
- Send immediate or scheduled emails
- Support for HTML and plain text formats
- CC/BCC functionality with multiple recipients
- Read receipt requests and custom encoding options
- **Flexible Scheduling**: Multiple scheduling options including custom date/time
- Timezone support for global operations

## Installation

### Prerequisites
- n8n installed and running
- Node.js 16+ and npm
- Zoho developer account with API access

### Installation Methods

#### Option 1: NPM Installation (Recommended)
```bash
npm install n8n-nodes-zoho
```

#### Option 2: Custom Nodes Directory
```bash
# Clone to your n8n custom nodes directory
git clone https://github.com/vladaman/n8n-nodes-zoho.git ~/.n8n/custom/n8n-nodes-zoho
cd ~/.n8n/custom/n8n-nodes-zoho
npm install
npm run build
```

#### Option 3: Development Setup
```bash
git clone https://github.com/vladaman/n8n-nodes-zoho.git
cd n8n-nodes-zoho
npm install
npm run build
npm test  # Run tests (optional)
```

After installation, restart n8n to load the new nodes and credentials.

## Configuration

### 1. Zoho Developer Setup
Before using the nodes, you need to create a Zoho application:

1. Go to [Zoho Developer Console](https://api-console.zoho.com/)
2. Create a new application and note your **Client ID** and **Client Secret**
3. Configure appropriate scopes based on the services you'll use:
   - **Sheets**: `ZohoSheet.operation.ALL`
   - **Tasks**: `ZohoTasks.operation.ALL`
   - **Billing**: `ZohoBilling.operation.ALL`  
   - **Email**: `ZohoMail.operation.ALL`

### 2. n8n Credential Configuration

1. In n8n, navigate to **Settings** → **Credentials**
2. Click **Add Credential** and select **Zoho API**
3. Configure the following settings:

   | Field | Value | Notes |
   |-------|-------|-------|
   | **Client ID** | Your Zoho app client ID | From developer console |
   | **Client Secret** | Your Zoho app client secret | Keep secure |
   | **Authorization URL** | Regional endpoint | See table below |
   | **Access Token URL** | Regional endpoint | See table below |
   | **Scope** | Service-specific scopes | Comma-separated |

#### Regional Endpoints

| Region | Authorization URL | Access Token URL |
|--------|-------------------|------------------|
| **US** | `https://accounts.zoho.com/oauth/v2/auth` | `https://accounts.zoho.com/oauth/v2/token` |
| **EU** | `https://accounts.zoho.com/oauth/v2/auth` | `https://accounts.zoho.eu/oauth/v2/token` |
| **India** | `https://accounts.zoho.com/oauth/v2/auth` | `https://accounts.zoho.in/oauth/v2/token` |
| **Australia** | `https://accounts.zoho.com/oauth/v2/auth` | `https://accounts.zoho.com.au/oauth/v2/token` |
| **China** | `https://accounts.zoho.com.cn/oauth/v2/auth` | `https://accounts.zoho.com.cn/oauth/v2/token` |

4. Click **Connect** and complete the OAuth2 authorization flow
5. Test the connection to ensure proper setup

## Usage Examples

### Zoho Sheets Examples

#### Create and Populate a Workbook
```javascript
// 1. Create Workbook Node
Operation: "Create Workbook"
Workbook Name: "Sales Report 2024"

// 2. Add Records Node  
Operation: "Add Records to Worksheet"
Workbook Resource ID: "{{$node["Create Workbook"].json["workbook"]["resource_id"]}}"
Worksheet Name: "Sheet1"
Header Row: 1
JSON Data: '[{"Name":"John","Sales":1000},{"Name":"Jane","Sales":1500}]'
```

#### List and Filter Workbooks
```javascript
Operation: "List Workbooks"
Start Index: 1
Count: 50
Sort Option: "recently_modified"
```

### Zoho Tasks Examples

#### Create and Manage Tasks
```javascript
// Personal Task
Operation: "Add Personal Task"
JSON Data: '{"title":"Review quarterly report","priority":"high","due_date":"2024-01-31"}'

// Group Task with Project
Operation: "Add Group Task"
Group ID: "your_group_id"
JSON Data: '{"title":"Website redesign","project_id":"proj_123","assignee":"user@company.com"}'
```

#### Task Updates and Management
```javascript
// Update Task Status
Operation: "Change Task Status"
Group ID: "your_group_id"
Task ID: "task_456"
JSON Data: '{"status":"completed"}'

// Set Reminder
Operation: "Set/Change Task Reminder"
JSON Data: '{"reminder_datetime":"2024-01-30T09:00:00Z","reminder_type":"email"}'
```

### Zoho Billing Examples

#### Customer and Subscription Management
```javascript
// List Customers
Operation: "List"
Resource: "Customer"
Organization ID: "your_org_id"

// Create Subscription
Operation: "Create"
Resource: "Subscription"
JSON Data: '{"customer_id":"cust_123","plan_id":"plan_456","starts_at":"2024-01-01"}'
```

#### Invoice and Payment Processing
```javascript
// Filter Invoices
Operation: "List"
Resource: "Invoice"
Filter By: "Overdue"
Customer ID: "cust_123"

// Create Payment
Operation: "Create"
Resource: "Payment"
JSON Data: '{"customer_id":"cust_123","amount":99.99,"payment_mode":"credit_card"}'
```

### Zoho Email Examples

#### Send Immediate Email
```javascript
Operation: "Send Email"
Account ID: "your_account_id"
From Address: "noreply@company.com"
To Address: "customer@email.com"
Subject: "Welcome to our service"
Content: "<h1>Welcome!</h1><p>Thanks for joining us.</p>"
Mail Format: "html"
```

#### Schedule Email Campaign
```javascript
Operation: "Send Email"
// ... basic email fields ...
Is Schedule: true
Schedule Type: 6  // Custom date & time
Time Zone: "GMT +5:30"
Schedule Time: "01/25/2024 10:30:00"
```

## Advanced Configuration

### Error Handling
All nodes include comprehensive error handling with detailed error messages. Use n8n's built-in error handling to:
- Retry failed requests
- Route errors to separate workflow paths
- Log errors for debugging

### Rate Limiting
Zoho APIs have rate limits. Consider:
- Adding delays between requests for bulk operations
- Using n8n's batch processing capabilities
- Implementing exponential backoff for retries

### Data Transformation
Leverage n8n's expression editor for:
- Dynamic parameter values
- Data format conversion
- Complex JSON manipulation

## API Documentation

Detailed API documentation is available in the `docs/` directory:
- [Email API Documentation](docs/Email.md) - Complete email functionality reference
- [Tasks API Documentation](docs/Tasks.md) - Task and project management details

## Development

### Project Structure
```
n8n-nodes-zoho/
├── credentials/          # OAuth2 credential definitions
├── nodes/               # Node implementations
│   ├── ZohoBilling.node.ts
│   ├── ZohoEmail.node.ts
│   ├── ZohoSheets.node.ts
│   ├── ZohoTasks.node.ts
│   ├── GenericFunctions.ts
│   └── types.ts
├── docs/                # API documentation
└── dist/                # Compiled output
```

### Building from Source
```bash
# Clone the repository
git clone https://github.com/vladaman/n8n-nodes-zoho.git
cd n8n-nodes-zoho

# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run tslint

# Watch for changes during development
npm run watch

# Run tests (if available)
npm test
```

### Development Scripts
- `npm run build` - Compile TypeScript and build distribution
- `npm run watch` - Watch for changes and rebuild automatically
- `npm run tslint` - Run TypeScript linting
- `npm run dev` - Alias for watch mode
- `npm run release` - Build and publish to npm

## Troubleshooting

### Common Issues

**Authentication Errors**
- Verify your Client ID and Client Secret are correct
- Ensure the correct regional endpoints are configured
- Check that your Zoho app has the required scopes
- Confirm your OAuth2 callback URL is properly set in Zoho Developer Console

**API Rate Limits**
- Implement delays between bulk operations
- Use n8n's batch processing features
- Monitor your API usage in Zoho Developer Console

**Regional Configuration**
- Double-check you're using the correct endpoints for your Zoho region
- Ensure your Zoho account and application are in the same region

### Getting Help
- Check the [GitHub Issues](https://github.com/vladaman/n8n-nodes-zoho/issues) for known problems
- Review the official [Zoho API Documentation](https://www.zoho.com/developer/)
- Consult the [n8n Community](https://community.n8n.io/) for workflow-specific questions

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** on GitHub
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the existing code style
4. **Add tests** if applicable
5. **Run linting** (`npm run tslint`)
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain backward compatibility
- Add appropriate error handling
- Update documentation for new features
- Test your changes thoroughly

## License

This project is licensed under the [GPL-3.0 License](https://opensource.org/licenses/GPL-3.0).

## Acknowledgments

- Built for the [n8n](https://n8n.io/) automation platform
- Uses [Zoho APIs](https://www.zoho.com/developer/) for service integration
- TypeScript implementation following n8n node development standards