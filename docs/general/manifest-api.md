---
id: manifest-api
title: Manifest API
sidebar_label: Manifest
---

The SocialHub Manifest API allows the manipulation of Channel Manifests. Manifests are automatically created for [Custom Channels](../integration#a-custom-channel) and define a Network's capabilities and configures communication with its Integration. A Custom Channel will start off with an empty default Manifest which should be adjusted as needed by the Integration.

Once a Manifest has been promoted to being ["Reusable"](../integration#b-reusable-manifest) it will appear as an available Network to Customers allowing the creation of additional Channels using the same configuration.

## Updating Manifests

Manifests can be partially updated using the REST API route `PATCH /manifest`.

The Manifest that should be updated is identified by looking up the Channel specified in the JWT. Note that once a Manifest has been promoted, it is currently no longer possible to update it without contacting the SocialHub Team.

Also take a look at the [Swagger API Reference](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/socialhubio/socialhub-dev/master/swagger.yaml).

### Example

Example Manifest manipulation request made with the unix tool cURL:

```bash
curl -X PATCH "https://api.socialhub.io/manifest?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1YzliNmIyYTU4YTg1NTA3NGQxZDI3OGYiLCJjaGFubmVsSWQiOiI1YzljMDE5NTJiZGZkNzE4MzA3YTBhNTMiLCJpYXQiOjE1NTQxMzQ1NDF9.mXomId0-stW1l4QQQkjeBflo74ZIHzd0-Xj_71VyncA" -d '
{
  "webhook": {
    "url": "https://socialhub.example.com/webhook",
    "secret": "random_32_or_more_chars_long_string"
  },
  "inbox": {
    "ticketActions": [{
      "type": "reply",
      "id": "reply-as-comment",
      "label": {
        "en": "Reply",
        "de": "Reply"
      }
    }],
    "rightSidebar": [{
       "id": "sidebar-id",
       "label": {
          "en": "sidebar-label",
          "de": "sidebar-label"
       },
       "treeBuilder": "flatListWithoutRoot"
    }]
  }
}
' -H "Content-Type: application/json"
```

### Request

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `name`          | Read only. Manifests of normal Custom Channels do not have a name. Manifests that have a name have been promoted to being reusable. The name is what will be shown as Network name on the Channel Settings page. |
| `branding`      | Optional Network branding such as icons and color schemes |
| `webhook`       | WebHook specific configuration. A test request will be made whenever this is updated! |
| `inbox`         | Inbox product specific configuration. |
| `callbacks`     | Redirect URLs for Channel management. |

#### `branding`

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `icon`          | HTTPS URL to Network icon (eg. Twitter Bird) |
| `fallback`      | HTTPS URL to fallback icon (eg. shown for ticket interactors without avatar) |
| `color`         | HTML Hex color code for Network branding (eg. Facebook blue `#3b5998` for Ticket borders) |

#### `webhook`

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `url`           | HTTPS URL of the Integration's WebHook. |
| `secret`        | Secret used for request signing. Should be a long random string with at least 32 characters. |

#### `inbox`

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `ticketActions` | Configures the actions available on Tickets within the Inbox. |
| `rightSidebar`  | Configures the tabs available in the right sidebar after clicking on a Ticket within the Inbox. |

#### `inbox.ticketActions[]`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `type`          | Type of the Ticket Action. At the moment we support `reply`, `template_reply` and `button` actions. There may be multiple actions of the same type. |
| `id`            | Identifier of the Action. Each Action within a manifest must have a different identifier. Pattern regular expression: `^[a-zA-Z0-9-_]{1,256}$` |
| `label`         | Button labels for different locales. Locale is selected depending on user settings. |
| `config`        | Configuration options for this Ticket Action. |
| `attachments`   | If set (`{}`) for Ticket Actions of type `reply`, it's possible to attach files for the reply. At a later point you'll be able to specify a file schema to control what kind of attachments are allowed – for now there is no restriction an all checks should happen on the Integration's end. |
| `options`       | Array of dropdown options for the action. At the moment supported for the `reply` action. If `options` are set for an action, the user will have to choose one from the dropdown before creating the reply. |

#### `inbox.ticketActions[].label`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `en`            | Human-readable label for English locale. |
| `de`            | Human-readable label for German locale. |

#### `inbox.ticketActions[].options[].label`
| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `en`            | Human-readable dropdown label for English locale. |
| `de`            | Human-readable dropdown label for German locale. |

#### `inbox.ticketActions[].config`

| Field              | Description                                               |
|--------------------|-----------------------------------------------------------|
| `approvalProcess`  | Boolean (default is `true`) controlling whether the Approval Process feature should be applied for this Ticket Action. Only supported for `reply` and `template_reply` at this moment |
| `templates.url`    | URL to fetch templates for the `template_reply` action from. Required for the `template_reply` action. |
| `timeout`          | Action timeout configuration options. |
| `forceTagging`     | Boolean (default is `true`) controlling whether the feature forcing the user to add tag(s) to the ticket should be applied for this Ticket Action. |

#### `inbox.ticketActions[].config.timeout`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `duration`      | Time after which the action is no longer available. Uses [juration](https://www.npmjs.com/package/juration#examples) for parsing. |
| `after`         | Field the timeout is counted from. Currently only `networkCreationTime` is supported, which bases the timeout on the `ticket.interaction.createdTime` field. |

#### `inbox.ticketActions[].attachments`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `noText`        | Boolean (default is `false`). If set to `true` then there is no additional text allowed when an attachment was added to the reply. |

#### `inbox.ticketActions[].options[]`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `id`            | Unique id of the option which will be sent to the integration in the reply payload. |
| `label`         | Human readable title of the option which will be shown to the user as button label. |
| `description`   | Optional description of the option which will be shown to the user below the reply editor once an option has been selected. |

#### `inbox.rightSidebar[]`

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `id`            | String identifier for this sidebar Tab. |
| `label`         | Button labels for different locales. Locale is selected depending on user settings. |
| `treeBuilder`   | The tree-builder algorithm to use. Currently only `flatListWithoutRoot` and `flatListWithRoot` are supported. |

The `flatListWithoutRoot` tree builder simply displays all Tickets in the right sidebar that share the same Root-Ticket excluding the Root-Ticket itself.

`flatListWithRoot` tree builder displays all Tickets with the same Root-Ticket including the Root-Ticket.
Root-Ticket in the sidebar will have some additional actions like `Show unread Tickets in the Inbox`.

#### `inbox.rightSidebar[].label`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `en`            |  Human-readable label for English locale. |
| `de`            |  Human-readable label for German locale. |

#### `callbacks`

| Field                 | Description                                                  |
|-----------------------|--------------------------------------------------------------|
| `channelCreation`     | HTTPS URL of an Integration website the Customer should be redirected to in order to add new Channels for a Reusable Manifest. |
| `channelReactivation` | HTTPS URL of an Integration website the Customer should be redirected to in order to reactivate an existing Channel belonging to a Reusable Manifest. |

### Responses

The following error responses should the handled by the Integration's client:

#### `HTTP 200 OK`

Returns the successfully updated Manifest object.

If the request body was empty (`{}`) nothing was updated and the current Manifest is simply returned in full.

#### `HTTP 422 Unprocessable Entity`

```json
{
  "code": "WebhookValidationError",
  "message": "Error: An error occurred while attempting to validate the WebHook",
  "data": "Error: getaddrinfo ENOTFOUND socialhub.example.com socialhub.example.com:443"
}
```

Is returned whenever the WebHook URL specified in the Manifest is not reachable by the HTTPS test request. The `data` value is the internal error that occurred when the test was attempted and should help debugging the issue.

It's also possible that we were able to execute the HTTPS request but the response did not contain a valid challenge response header:

```json
{
  "code": "WebhookValidationError",
  "message": "Error: The WebHook failed to solve the challenge"
}
```

Or that the SSL certificate the WebHook is hosted with is no longer valid:

```
{
  "code": "WebhookValidationError",
  "message": "Error: An error occurred while attempting to validate the WebHook",
  "data": "Error: certificate has expired"
}
```

## Callbacks

### Channel Creation

Is required to be set for Reusable Manifests in `callbacks.channelCreation`. SocialHub will redirect users clicking on the "Add Channel" Button of a Reusable Manifest Network to this URL with a special temporary JWT (as `?token=` query parameter) that can only be used for the Channel creation route.

This JWT has the following payload:

```javascript
{
  "accountId": "5c9b6b2a58a855074d1d278f",  // Id of the Account the token belongs to
  "manifestId": "5e73f56c5a45da10b6e614dd", // Id of the Manifest the User wants to create channels for
  "userId": "5e73f5255a45da10b6e614da",     // Id of the User wanting to create channels
  "origin": "https://app.socialhub.io",     // URL of the SocialHub platform to redirect back to
  "iat": 1554134541,                        // Timestamp in seconds of the token issuing date
  "exp": 1554136341                         // Timestamp in seconds of the token expiration date (30 mins)
}
```

### Channel Reactivation

May be set for Reusable Manifests in `callbacks.channelReactivation`. SocialHub will redirect users wanting to reactivate a disabled Channel belonging the Integration's Reusable Manifest to this URL with a special temporary JWT (as `?token=` query parameter) that can only be used for the Channel creation route (which is also used for reactivating Channels).

This JWT has the following payload:

```javascript
{
  "accountId": "5c9b6b2a58a855074d1d278f",  // Id of the Account the token belongs to
  "manifestId": "5e73f56c5a45da10b6e614dd", // Id of the Manifest the User wants to create channels for
  "userId": "5e73f5255a45da10b6e614da",     // Id of the User wanting to create channels
  "origin": "https://app.socialhub.io",     // URL of the SocialHub platform to redirect back to
  "channelId": "5c9c01952bdfd718307a0a53",  // Id of the Channel that should be reactivated
  "uniqueName": "test",                     // Unique name of the Channel
  "networkId": "39272404",                  // Unique network ID of the Channel (optional)
  "iat": 1554134541,                        // Timestamp in seconds of the token issuing date
  "exp": 1554136341                         // Timestamp in seconds of the token expiration date (30 mins)
}
```

### Templates

Ticket Actions of type `template_reply` require a callback URL to be set (`inbox.ticketActions[].config.templates.url`) from where a list of available templates are fetched from.

The ID of the Channel the templates are requested for will be passed as `?channelId=` query parameter. For additional security the request will be [signed the same way a WebHook](../webhooks#verification) request would be.

This callback URL should return templates and their variables following this example:

```javascript
[{
  // Human readable name of the template to display to the SocialHub user.
  "name": "Test Greeting",
  // Machine identifier of the template.
  "networkId": "test_greeting",
  // Variables the user may fill out for this template (json schema format).
  "variables": {
    "firstName": {
      "type": "string",
      "minLength": 2,
      "maxLength": 12
    }
  },
  // Text templates used for previewing message (handlebars format).
  "text": {
    "en": "Hello {{firstName}}",
    "de": "Hallo {{firstName}}",
    "fr": "Bienvenue {{firstName}}"
  }
}]
```

The `networkId` of the Template the user selected and the values the variables have been filled with, will be sent as part of the [`ticket_action` event payload](../inbox/ticket-api#ticket-action-type-template-reply) once the `template_reply` Action has been submitted.