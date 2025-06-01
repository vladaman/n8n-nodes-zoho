Okay, here is the Markdown documentation generated from the provided text.

```markdown
# Tasks API

## Overview

The Tasks API facilitates the retrieval of tasks assigned to you, tasks added to a group, and enables task addition and management, etc.

## Authentication

When using any API related to tasks, you must include the `ZohoMail.tasks` OAuth scope in your request.

## API Endpoints

Below is a list of the available endpoints in the Tasks API:

---

### Add a new group or personal task

*   **Method:** `POST`
*   **Purpose:** To add a new group or personal task.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoints:**
    *   **Group Tasks:** `/api/tasks/groups/{zgid}`
    *   **Personal Tasks:** `/api/tasks/me`
*   **Path Parameters:**
    *   `{zgid}` (for Group Tasks): The ID of the group.
*   **Request Body:** Required (details not provided in source).

---

### Add a new project

*   **Method:** `POST`
*   **Purpose:** To add a new project within a group.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups/{zgid}/projects`
*   **Path Parameters:**
    *   `{zgid}`: The ID of the group.
*   **Request Body:** Required (details not provided in source).

---

### Get all tasks in a group or all personal tasks

*   **Method:** `GET`
*   **Purpose:** Retrieve all tasks for a specific group or all your personal tasks.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoints:**
    *   **Group Tasks:** `/api/tasks/groups/{zgid}`
    *   **Personal Tasks:** `/api/tasks/me`
*   **Path Parameters:**
    *   `{zgid}` (for Group Tasks): The ID of the group.
*   **Query Parameters:** May support filtering (e.g., by status), see "Get all tasks in a group with given status".

---

### Get all tasks assigned to you

*   **Method:** `GET`
*   **Purpose:** Retrieve all tasks that have been assigned to the authenticated user.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks`

---

### Get all tasks created by you

*   **Method:** `GET`
*   **Purpose:** Retrieve all tasks that were created by the authenticated user.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks`
*   **Note:** This endpoint `/api/tasks` is also used for "Get all tasks assigned to you". It likely requires a query parameter or different authentication context to distinguish.

---

### Get a specific task

*   **Method:** `GET`
*   **Purpose:** Retrieve the details of a specific task.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoints:**
    *   **Group Tasks:** `/api/tasks/groups/{zgid}/{taskId}`
    *   **Personal Tasks:** `/api/tasks/me/{taskId}`
*   **Path Parameters:**
    *   `{zgid}` (for Group Tasks): The ID of the group.
    *   `{taskId}`: The ID of the task.

---

### Get all subtasks under a task

*   **Method:** `GET`
*   **Purpose:** Retrieve all subtasks associated with a specific parent task.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoints:**
    *   **Group Tasks:** `/api/tasks/groups/{zgid}/{taskId}/subtasks`
    *   **Personal Tasks:** `/api/tasks/me/{taskId}/subtasks`
*   **Path Parameters:**
    *   `{zgid}` (for Group Tasks): The ID of the group.
    *   `{taskId}`: The ID of the parent task.

---

### Get all projects in a group

*   **Method:** `GET`
*   **Purpose:** Retrieve all projects within a specific group.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups/{zgid}/projects`
*   **Path Parameters:**
    *   `{zgid}`: The ID of the group.

---

### Get all tasks in a project

*   **Method:** `GET`
*   **Purpose:** Retrieve all tasks belonging to a specific project within a group.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups/{zgid}/projects/{projectId}`
*   **Path Parameters:**
    *   `{zgid}`: The ID of the group.
    *   `{projectId}`: The ID of the project.
*   **Query Parameters:** May support filtering (e.g., by status), see "Get all tasks in a project with given status".

---

### Get all tasks in a project with given status

*   **Method:** `GET`
*   **Purpose:** Retrieve all tasks belonging to a specific project within a group, filtered by status.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups/{zgid}/projects/{projectId}`
*   **Path Parameters:**
    *   `{zgid}`: The ID of the group.
    *   `{projectId}`: The ID of the project.
*   **Query Parameters:** Requires a parameter to specify the status (e.g., `?status=completed`).

---

### Get all groups

*   **Method:** `GET`
*   **Purpose:** Retrieve details for all groups the user has access to.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups`

---

### Get all tasks in a group with given status

*   **Method:** `GET`
*   **Purpose:** Retrieve all tasks within a specific group, filtered by status.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups/{zgid}`
*   **Path Parameters:**
    *   `{zgid}`: The ID of the group.
*   **Query Parameters:** Requires a parameter to specify the status (e.g., `?status=completed`).

---

### Get member details in a group

*   **Method:** `GET`
*   **Purpose:** Retrieve details for all members of a specific group.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups/{zgid}/members`
*   **Path Parameters:**
    *   `{zgid}`: The ID of the group.

---

### Update Task Properties

*   **Method:** `PUT`
*   **Purpose:** Modify various properties of an existing task.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoints:**
    *   **Group Tasks:** `/api/tasks/groups/{zgid}/{taskId}`
    *   **Personal Tasks:** `/api/tasks/me/{taskId}`
*   **Path Parameters:**
    *   `{zgid}` (for Group Tasks): The ID of the group.
    *   `{taskId}`: The ID of the task.
*   **Request Body:** Required, containing the property to change and its new value. Properties that can be changed include:
    *   Change task title
    *   Change task description
    *   Change task priority
    *   Change task status
    *   Change task project
    *   Change task assignee
    *   Set/ change task due date
    *   Set/ change task reminder
    *   Set/ change task reminder based on due date
    *   Set/ change recurring task

---

### Edit a project

*   **Method:** `PUT`
*   **Purpose:** Modify the details (e.g., name) of an existing project.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups/{zgid}/projects/{projectId}`
*   **Path Parameters:**
    *   `{zgid}`: The ID of the group.
    *   `{projectId}`: The ID of the project.
*   **Request Body:** Required (details not provided in source, likely contains the new project name).

---

### Delete a project

*   **Method:** `DELETE`
*   **Purpose:** Delete an existing project within a group.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoint:** `/api/tasks/groups/{zgid}/projects/{projectId}`
*   **Path Parameters:**
    *   `{zgid}`: The ID of the group.
    *   `{projectId}`: The ID of the project.

---

### Delete a group or personal task

*   **Method:** `DELETE`
*   **Purpose:** Delete a specific task.
*   **OAuth Scope:** `ZohoMail.tasks`
*   **Endpoints:**
    *   **Group Tasks:** `/api/tasks/groups/{zgid}/{taskId}`
    *   **Personal Tasks:** `/api/tasks/me/{taskId}`
*   **Path Parameters:**
    *   `{zgid}` (for Group Tasks): The ID of the group.
    *   `{taskId}`: The ID of the task.

```


```markdown
# Send an Email API

## Purpose

This API is used to send an email.

## OAuth Scope

Use the scope `ZohoMail.messages.ALL` or `ZohoMail.messages.CREATE` to generate the Authtoken.

*   `ZohoMail.messages.ALL` - Grants full access to messages.
*   `ZohoMail.messages.CREATE` - Grants access to create messages.

## Request URL

*   **Method:** `POST`
*   **URL:** `https://mail.zoho.com/api/accounts/{accountId}/messages`

## Path Parameters

*   **`accountId`** (`long`, *Mandatory*)
    *   This key is used to identify the account from which the email has to be sent. It is generated during account addition.
    *   This parameter can be fetched from the [Get All User Accounts API](link_to_get_accounts_api).

## Request Body (JSON object)

*   **`fromAddress`** (`string`, *Mandatory*)
    *   Provide the sender's email address (associated with the authenticated account).
    *   Allowed values: Valid email address corresponding to the authenticated account for the From field.
*   **`toAddress`** (`string`, *Mandatory*)
    *   Provide the recipient's email address.
    *   Allowed values: Valid recipient email address for the To field.
*   **`ccAddress`** (`string`)
    *   Provide the recipient's email address for the Cc field.
    *   Allowed values: Valid recipient email address for the Cc field.
*   **`bccAddress`** (`string`)
    *   Provide the recipient's email address for the Bcc field.
    *   Allowed values: Valid recipient email address for the Bcc field.
*   **`subject`** (`string`)
    *   Provide the subject of the email.
*   **`content`** (`string`)
    *   Provide the content of the email.
*   **`mailFormat`** (`string`)
    *   Specify the format in which the mail needs to be sent.
    *   Allowed values:
        *   `html`
        *   `plaintext`
    *   The default value is `html`.
*   **`askReceipt`** (`string`)
    *   Specifies whether a Read receipt from the recipient is requested or not.
    *   Allowed values:
        *   `yes` - Requesting a read receipt.
        *   `no` - Not requesting a read receipt.
*   **`encoding`** (`string`)
    *   Specifies the encoding that is to be used in the email content.
    *   Allowed values:
        *   `Big5`
        *   `EUC-JP`
        *   `EUC-KR`
        *   `GB2312`
        *   `ISO-2022-JP`
        *   `ISO-8859-1`
        *   `KOI8-R`
        *   `Shift_JIS`
        *   `US-ASCII`
        *   `UTF-8`
        *   `WINDOWS-1251`
        *   `X-WINDOWS-ISO2022JP`
    *   The default value is `UTF-8`.

*   - Mandatory parameter

---

## Scheduling Emails

With this API, you can also schedule when to send your email. To schedule an email, follow the same procedure as above along with the upcoming additional parameters.

*   **`isSchedule`** (`boolean`)
    *   Depending on whether the mail has to be scheduled or not.
    *   Allowed values:
        *   `true` - if the email should be scheduled.
        *   `false` - if the email should be sent immediately.
*   **`scheduleType`** (`int`)
    *   Specifies the type of scheduling.
    *   Allowed values:
        *   `1` - Schedules email to be sent after one hour from the time of the request.
        *   `2` - Schedules email to be sent after two hours from the time of the request.
        *   `3` - Schedules email to be sent after four hours from the time of the request.
        *   `4` - Schedules email to be sent by the morning of the next day from the time of the request.
        *   `5` - Schedules email to be sent by the afternoon of the next day from the time of the request.
        *   `6` - Schedules email to be sent on the custom date and time of your choice.
*   **`timeZone`** (`string`)
    *   Specify the timezone to schedule your email.
    *   This parameter is mandatory if `scheduleType` is set to value `6`.
    *   For example: `GMT 5:30` (India Standard Time - Asia/Calcutta).
*   **`scheduleTime`** (`string`)
    *   Specify the date and time you want to schedule your email.
    *   This parameter is mandatory if `scheduleType` is set to value `6`.
    *   Format: `MM/DD/YYYY HH:MM:SS`.
    *   For example: `09/15/2023 14:30:28`.

---

## Response Codes

Refer [here](link_to_response_codes) for the response codes and their meaning.

---

## Sample Request

```bash
curl "https://mail.zoho.com/api/accounts/123456789/messages" \
-X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization:Zoho-oauthtoken *****" \
-d '{
   "fromAddress": "rebecca@zylker.com",
   "toAddress": "paula@zylker.com",
   "ccAddress": "david@zylker.com",
   "bccAddress": "rebecca11@zylker.com",
   "subject": "Email - Always and Forever",
   "content": "Email can never be dead. The most neutral and effective way, that can be used for one to many and two way communication.",
   "askReceipt" : "yes"
}'
```