---
id: ticket-api
title: Ticket API
sidebar_label: Ticket
---

The SocialHub Ticket API is allows the cration of Custom Tickets for Custom Channels. By default these Tickets will only have network-agnostic Actions available. Actions that require changes to be made on the network (eg. Replies made to a Ticket), must be configured in the Channels Manifest. If a WebHook is configured, it will receive information about executed Ticket Actions as Events.

## Creating Tickets

Tickets are created using the REST API route `POST /inbox/tickets`.

Also take a look at the [Swagger API Reference](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/socialhubio/socialhub-dev/master/swagger.yaml).

### Example

Example Ticket creation request made with the unix tool cURL:

```bash
curl -X POST "https://app.socialhub.io/api2/public/inbox/tickets?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1YzliNmIyYTU4YTg1NTA3NGQxZDI3OGYiLCJjaGFubmVsSWQiOiI1YzljMDE5NTJiZGZkNzE4MzA3YTBhNTMiLCJpYXQiOjE1NTQxMzQ1NDF9.mXomId0-stW1l4QQQkjeBflo74ZIHzd0-Xj_71VyncA" -d '
{
 "interaction": {
   "message": "Hello, can someone help me?",
   "createdTime": "2019-01-28T16:58:12.736Z",
   "networkItemId": "question-q_0000000001",
   "url": "http://example.com/questions/q_0000000001",
   "pictures": [{
     "small": "https://example.com/questions/q_0000000001/images/1/thumbnail.png",
     "large": "https://example.com/questions/q_0000000001/images/1/original.png"
   }]
 }
}
' -H "Content-Type: application/json"
```

### Request

A Ticket is an entity managed within the SocialHub Inbox. A Ticket contains the Information about the Interaction (eg. a comment on a Facebook post) it represents. The Integration will request the Interaction's information from a data-source and use it to create a Ticket via the SocialHub API.

#### `ticket`

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `interaction`   | Contains the Interaction's information as Ticket sub-object. |

#### `interaction`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `message`       | Message text of an Interaction (eg. the Text of a Facebook comment). May have up to 10.000 characters. Optional if there are `pictures` or `attachments`. |
| `pictures`      | List of images of an Interaction (eg. a Facebook post with one or multiple images). Optional if there is a `message` or `attachments`. |
| `attachments`   | List of file attachments of an Interaction (eg. a Direct Message with one or multiple files attached). Optional if there is a `message` or `pictures`. |
| `createdTime`   | Optional: The Interaction's creation time (as ISO 8601). For Facebook this would for example be the date and time when a comment was created. If this field is not specified the current date will be used. |
| `networkItemId` | A unique identifier of the Interaction within a Custom Channel. A `HTTP 409 Conflict` will be returned if you attempt to create a Ticket with an identifier that has already been used for another Ticket within the same Channel. Allowed pattern as regular expression: `^[a-zA-Z0-9/_-]{6,256}$` |
| `url`           | Optional: Link to the Interaction. This link will be used by SocialHub Users to eg. allow them to access the Interaction directly on the networks website |

#### `interaction.pictures[]`

| Field            | Description                                              |
|------------------|----------------------------------------------------------|
| `small`          | URL of a thumbnail version of the image. URL must support HTTPS protocol. |
| `large`          | Optional: URL of the original version of the image. If set, URL must support HTTPS protocol. |

#### `interaction.attachments[]`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `url`           | URL to download the attached file.URL must support HTTPS protocol. |
| `name`          | Optional: Attachment filename. |
| `size`          | Optional: Numerical filesize in bytes. |
| `mimeType`      | Optional: Attachment filetype as mime-type (eg. "application/pdf") |

### Responses

The following responses of the SocialHub Ticket API should the handled by the Integration's client:

#### `HTTP 200 OK`

Represents the successful creation of the Ticket. The newly created ticket object will be returned.

Example:
```json
{
  "_id": "5cc1b08ad62ec72e8388cb47",
  "channelId": "5cc1afd1d62ec72e8388cb46",
  "accountId": "5cb9003af1bb6808381d184d",
  "createdTime": "2019-04-25T13:05:14.413Z",
  "interaction": {
    "socialNetwork": "CUSTOM",
    "createdTime": "2019-01-28T16:58:12.736Z",
    "type": "TICKET",
    "message": "Hello, can someone help me?",
    "networkItemId": "question-q_0000000001",
    "url": "http://example.com/questions/q_0000000001",
    "attachments": [],
    "pictures": [
      {
        "large": "https://example.com/questions/q_0000000001/images/1/original.png",
        "small": "https://example.com/questions/q_0000000001/images/1/thumbnail.png"
      }
    ]
  }
}
```

The `_id` value is a unique identifier of a Ticket within the SocialHub Inbox. You might want to store it in reference to the Interactions within your Integration.

#### `HTTP 409 Conflict`

```json
{
 "code": "ConflictError",
 "message": "Error: Ticket with such network item id already exists"
}
```

Means that you already created a Ticket using the same unique Interaction identifier within the Channel. If your Integration is functioning properly you can probably refrain from further attempts.

## Receiving Ticket Action Events

We differentiate between two types of Ticket Actions:
1. **Network Agnostic Actions** are always available for all Tickets in the Inbox. An Integration does not have control over them and will not receive events of their execution. Example Actions are: Assigning a Ticket to a User, Archiving a Ticket ("Done" Button) or creating an internal Note Followup on the Ticket.
2. **Network Specific Actions** need to be configured by an Integration in the Channel's Manifest. They are specific to the Network and their execution will be communicated with the Integration as Events delivered to a configured WebHook.

### Registration in Manifest

The [WebHook](webhooks.md) and Network Specific Ticket Action can be set using the `PATCH /channels/manifest` REST API route.

#### Example

```bash
curl -X PATCH "https://app.socialhub.io/api2/public/channels/manifest?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1YzliNmIyYTU4YTg1NTA3NGQxZDI3OGYiLCJjaGFubmVsSWQiOiI1YzljMDE5NTJiZGZkNzE4MzA3YTBhNTMiLCJpYXQiOjE1NTQxMzQ1NDF9.mXomId0-stW1l4QQQkjeBflo74ZIHzd0-Xj_71VyncA" -d '
{
  "webhook": {
    "url": "https://socialhub.example.com/webhook",
    "secret": "a_random_secret_string"
  },
  "inbox": {
    "ticketActions": [{
      "type": "reply",
      "id": "reply-as-comment",
      "label": "Reply"
    }]
  }
}
' -H "Content-Type: application/json"
```

#### `inbox.ticketActions[]`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `type`          | Type of the Ticket Action. At the moment we only support the `reply` action. There may be multiple actions of the same type. |
| `id`            | Identifier of the Action. Each Action within a manifest must have a different identifier. Pattern regular expression: `^[a-zA-Z0-9-_]{1,256}$` |
| `label`         | Human readable button label for this action. May be up to 256 characters long but should be as short as possible. |


### Ticket Action Events

The WebHook request body will look like this when delivering Ticket Action events:

```json
{
  "manifestId": "5cc1afd1d62ec72e8388cb45",
  "accountId": "5cb9003af1bb6808381d184d",
  "channelId": "5cc1afd1d62ec72e8388cb46",
  "events": {
    "ticket_action": [
      {
        "ticketId": "5cc1b08ad62ec72e8388cb47",
        "networkItemId": "question-q_0000000001",
        "actionId": "",
        "payload": {},
        "time": 1556201893268,
        "uuid": "4616f2f0-5069-4ee8-ad95-4c106c277eb3"
      }
    ]
  }
}
```

#### `events.ticket_action[]`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `ticketId`      | Unique identifier of the Ticket that was replied. Same identifier as returned when the Ticket was created. |
| `networkItemId` | Unique identifier of the Interaction of the Ticket that was replied. Same identifier as used when the Ticket was created. |
| `actionId`      | Identifier of the Ticket Action as configured in the Manifest (`inbox.ticketActions[].id`). |
| `payload`       | Optional Ticket Action payload. Contains Ticket Action specific data. |
| `time`          | Unix timestamp in ms of when this event was created (intended for debugging purposes). |
| `uuid`          | Unique identifier of the event (intended for debugging purposes). |

#### Ticket Action Type: `reply`

```json
{
  "ticketId": "5cc1b08ad62ec72e8388cb47",
  "networkItemId": "question-q_0000000001",
  "actionId": "reply-as-comment",
  "payload": {
    "text": "Hello! Sure, how can we assist you?",
    "followupId": "f5f75b50-6764-11e9-9ce6-3507264c7519"
  },
}
```

#### `payload`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `text`          | The Text that was specified by the SocialHub User to publicly reply to the Interaction with. |
| `followupId`    | Unique identifier of the Reply-Folloup that was created on the Ticket. |
