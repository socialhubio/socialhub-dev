---
id: ticket-api
title: Ticket API
sidebar_label: Ticket
---

The SocialHub Ticket API allows the creation of Custom Tickets for Custom Channels. By default these Tickets will only have [network-agnostic Actions](#receiving-ticket-action-events) available. Actions that require changes to be made on the network (eg. Replies made to a Ticket), must be configured in the [Manifest](../general/manifest-api#inboxticketactions). If a [WebHook](../webhooks) is configured, it will receive information about executed Ticket Actions as Events.

## Creating Tickets

Tickets are created using the REST API route `POST /inbox/tickets`.

Also take a look at the [Swagger API Reference](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/socialhubio/socialhub-dev/master/swagger.yaml).

### Example

Example Ticket creation request made with the unix tool cURL:

```bash
curl -X POST "https://api.socialhub.io/inbox/tickets?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1YzliNmIyYTU4YTg1NTA3NGQxZDI3OGYiLCJjaGFubmVsSWQiOiI1YzljMDE5NTJiZGZkNzE4MzA3YTBhNTMiLCJpYXQiOjE1NTQxMzQ1NDF9.mXomId0-stW1l4QQQkjeBflo74ZIHzd0-Xj_71VyncA" -d '
{
 "interaction": {
   "message": "Hello, can someone help me?",
   "createdTime": "2019-01-28T16:58:12.736Z",
   "networkItemId": "question-q_0000000001",
   "url": "http://example.com/questions/q_0000000001",
   "pictures": [{
     "small": "https://example.com/questions/q_0000000001/images/1/thumbnail.png",
     "large": "https://example.com/questions/q_0000000001/images/1/original.png"
   }],
   "root": {
     "rootId": "conversation-48622799"
   },
   "interactor": {
     "interactorId": "u_5678986543",
     "name": "Jork Schrank",
     "url": "https://example.com/user/u_5678986543",
     "picture": "https://example.com/user/u_5678986543/avatar.png"
   }
 }
}
' -H "Content-Type: application/json"
```

### Request

A Ticket is an entity managed within the SocialHub Inbox. A Ticket contains the Information about the Interaction (eg. a comment on a Facebook post) it represents. The Integration will request the Interaction's information from a data-source and use it to create a Ticket via the SocialHub API.

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `interaction`   | Contains the Interaction's information as Ticket sub-object. |

Note that the `followupTo` field cannot be specified during Ticket creation. Rather it is automatically set for Tickets that are created for replies after calling the [Reply Success Confirmation](#reply-success-confirmation) callback.

#### `interaction`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `message`       | Message text of an Interaction (eg. the Text of a Facebook comment). May have up to 10.000 characters. Optional if there are `pictures`, `attachments` or `link`. |
| `pictures`      | List of images of an Interaction (eg. a Facebook post with one or multiple images). Optional if there is a `message`, `link` or `attachments`. |
| `attachments`   | List of file attachments of an Interaction (eg. a Direct Message with one or multiple files attached). Optional if there is a `message`, `link` or `pictures`. |
| `link`          | Link url shared on the Interaction. This url will be clickable in the SocialHub interface. Optional if there is a `message`, `pictures` or `attachments` |
| `createdTime`   | Optional: The Interaction's creation time (as ISO 8601). For Facebook this would for example be the date and time when a comment was created. If this field is not specified the current date will be used. |
| `networkItemId` | A unique identifier of the Interaction within a Custom Channel. A `HTTP 409 Conflict` will be returned if you attempt to create a Ticket with an identifier that has already been used for another Ticket within the same Channel. Allowed pattern as regular expression: `^[a-zA-Z0-9/_-]{6,256}$` |
| `interactor`    | Optional: Information about the person that created the interaction. (eg. a Facebook User) |
| `url`           | Optional: Link to the Interaction. This link will be used by SocialHub Users to eg. allow them to access the Interaction directly on the networks website. |
| `root`          | Optional: Stores Root-Ticket information. |
| `rating`        | Optional: Stores rating/review information. |

#### `interaction.pictures[]`

| Field            | Description                                              |
|------------------|----------------------------------------------------------|
| `small`          | URL of a thumbnail version of the image. URL must support HTTPS protocol. |
| `large`          | Optional: URL of the original version of the image. If set, URL must support HTTPS protocol. |

#### `interaction.attachments[]`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `url`           | URL to download the attached file. URL must support HTTPS protocol. |
| `name`          | Optional: Attachment filename. |
| `size`          | Optional: Numerical filesize in bytes. |
| `mimeType`      | Optional: Attachment filetype as mime-type (eg. "application/pdf") |

#### `interaction.interactor`

| Field            | Description                                              |
|------------------|----------------------------------------------------------|
| `interactorId`   | A network specific unique identifier of the person that caused this interaction. If multiple Tickets share an interactor with the same id they will be linked automatically (eg. for the right sidebar user history). If the ID matches the Channel's `networkId`, the Ticket will not appear as an unread Ticket in the Inbox because it was most likely caused by an external action by the Customer owning the Channel. |
| `name`           | Name of the person that caused this interaction. |
| `url`            | Optional: URL of the person's profile. |
| `picture`        | Optional: HTTPS URL of the person's avatar picture. |

#### `interaction.root`

| Field            | Description                                              |
|------------------|----------------------------------------------------------|
| `rooId`          | `networkItemId` of the Root-Ticket of this Ticket. Used for [right sidebar Tree-Building](../general/manifest-api#inboxrightsidebar). If referenced Root-Ticket does not exist a new empty hidden Ticket will be automatically created. |

#### `interaction.rating`

| Field            | Description                                              |
|------------------|----------------------------------------------------------|
| `value`          | Rating value. This would be `7` in a 7/10 rating. |
| `scale`          | Rating scale. This would be `10` in a 7/10 rating. |

### Responses

The following responses of the SocialHub Ticket API should the handled by the Integration's client:

#### `HTTP 201 Created`

Represents the successful creation of the Ticket. The newly created ticket object will be returned.

Example:
```json
{
  "channelId": "5eb47954a545b82b5b522cce",
  "accountId": "5e73f5245a45da10b6e614d8",
  "_id": "5eb493dcac52392e08513417",
  "createdTime": "2020-05-07T23:03:56.384Z",
  "interaction": {
    "createdTime": "2019-01-28T16:58:12.736Z",
    "message": "Hello, can someone help me?",
    "networkItemId": "question-q_0000000001",
    "url": "http://example.com/questions/q_0000000001",
    "root": {
      "url": null,
      "rootId": "conversation-48622799",
      "createdTime": "2020-05-07T23:03:56.336Z"
    },
    "interactor": {
      "url": "https://example.com/user/u_5678986543",
      "name": "Jork Schrank",
      "picture": "https://example.com/user/u_5678986543/avatar.png",
      "interactorId": "5eb493dcac52392e08513416"
    },
    "attachments": [],
    "pictures": [
      {
        "small": "https://example.com/questions/q_0000000001/images/1/thumbnail.png",
        "large": "https://example.com/questions/q_0000000001/images/1/original.png"
      }
    ]
  }
}
```

The `_id` value is a unique identifier of a Ticket within the SocialHub Inbox. You might want to store it in reference to the Interactions within your Integration.

Note that SocialHub will store the `interactor.interactorId` that you sent separately. The `interactorId` returned in the response will be the interactor identifier of SocialHub. SocialHub will automatically link the network specific `interactorId` that you sent to the SocialHub specific ID if we have already received it once.

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

The [WebHook](webhooks.md) and Network Specific Ticket Action options can be set using the [Manifest API](../general/manifest-api#updating-manifests).

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
        "type": "",
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
| `type`          | Type of the Ticket Action (can only be `reply` at this time) |
| `actionId`      | Identifier of the Ticket Action as configured in the Manifest (`inbox.ticketActions[].id`). |
| `payload`       | Optional Ticket Action payload. Contains Ticket Action specific data. |
| `time`          | Unix timestamp in ms of when this event was created (intended for debugging purposes). |
| `uuid`          | Unique identifier of the event (intended for debugging purposes). |

#### Ticket Action Type: `reply`

```json
{
  "ticketId": "5cc1b08ad62ec72e8388cb47",
  "networkItemId": "question-q_0000000001",
  "type": "reply",
  "actionId": "reply-as-comment",
  "payload": {
    "text": "Hello! Sure, how can we assist you?",
    "followupId": "f5f75b50-6764-11e9-9ce6-3507264c7519"
  },
}
```

##### `payload`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `text`          | The Text that was specified by the SocialHub User to publicly reply to the Interaction with. |
| `followupId`    | Unique identifier of the Reply-Folloup that was created on the Ticket. |

#### Ticket Action Type: `template_reply`

```json
{
  "ticketId": "5cc1b08ad62ec72e8388cb47",
  "networkItemId": "question-q_0000000001",
  "type": "template_reply",
  "actionId": "reply-with-template",
  "payload": {
    "followupId": "f5f75b50-6764-11e9-9ce6-3507264c7519",
    "name": "Test Greeting",
    "networkId": "test_greeting",
    "variables": {
      "firstName": "Jork"
    },
    "language": "de",
  },
}
```

##### `payload`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `followupId`    | Unique identifier of the Reply-Folloup that was created on the Ticket. |
| `name`          | Human readable name of the selected template |
| `networkId`     | Network ID of the selected template |
| `variables`     | Key-value map of variable names and their values |
| `language`      | Selected language value |

##### Reply Success Confirmation

After receiving the Reply event the Integration should asynchronously attempt to create the Reply on the Network. For example if the Integration is for Facebook and the Ticket Interaction was a Post created on a Facebook Page by a Fan, then the Reply created on the Ticket should be created as a Comment on the Facebook Post.

If the Reply was processed successfully by the Integration, the success callback located at `POST /inbox/tickets/:ticketId/replies/:followupId/success` should be called like this:

```bash
curl -X POST "https://api.socialhub.io/inbox/tickets/5cc1b08ad62ec72e8388cb47/replies/f5f75b50-6764-11e9-9ce6-3507264c7519/success?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1YzliNmIyYTU4YTg1NTA3NGQxZDI3OGYiLCJjaGFubmVsSWQiOiI1YzljMDE5NTJiZGZkNzE4MzA3YTBhNTMiLCJpYXQiOjE1NTQxMzQ1NDF9.mXomId0-stW1l4QQQkjeBflo74ZIHzd0-Xj_71VyncA" -d '
{
 "interaction": {
   "createdTime": "2019-01-28T17:02:03.153Z",
   "networkItemId": "answer-a_0000000052",
   "url": "http://example.com/questions/q_0000000001/a_0000000052"
 }
}
' -H "Content-Type: application/json"
```

#### `interaction`

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `createdTime`   | Optional: The Reply's creation time (as ISO 8601) on the Network. If this field is not specified the current date will be used. |
| `networkItemId` | A unique identifier of the Reply within a Custom Channel. A `HTTP 409 Conflict` will be returned if the identifier has already been used for another Ticket within the same Channel. Allowed pattern as regular expression: `^[a-zA-Z0-9/_-]{6,256}$` |
| `url`           | Optional: Link to the Interaction.                        |

#### Ticket Action Type: `button`

```json
{
  "ticketId": "5cc1b08ad62ec72e8388cb47",
  "networkItemId": "question-q_0000000001",
  "type": "button",
  "actionId": "like-button",
  "payload": {},
}
```
This action type does not need success confirmation, so if the corresponding Action succeeded on the Network, the Integration does not need to send any further requests to the SocialHub API.

However, if the Ticket Action has failed, this should be communicated (see [Error Handling](#error-handling)).

### Error Handling

Ticket Actions are processed asynchronously by the Integration. To handle cases where the Action has failed, for example because the Integration was unable to apply it on the Network, there is a callback route that informs the Community Managers of the failure: `POST /inbox/tickets/:ticketId/reset/:actionId`.

```bash
curl -X POST "https://api.socialhub.io/inbox/tickets/5cc1b08ad62ec72e8388cb47/reset/reply-as-comment?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1YzliNmIyYTU4YTg1NTA3NGQxZDI3OGYiLCJjaGFubmVsSWQiOiI1YzljMDE5NTJiZGZkNzE4MzA3YTBhNTMiLCJpYXQiOjE1NTQxMzQ1NDF9.mXomId0-stW1l4QQQkjeBflo74ZIHzd0-Xj_71VyncA" -d '
{
  "followupId": "f5f75b50-6764-11e9-9ce6-3507264c7519",
  "reason": "Failed to create the Reply because the Interaction has been deleted on the Network."
}
' -H "Content-Type: application/json"
```

| Field           | Description                                               |
|-----------------|-----------------------------------------------------------|
| `followupId`    | The identifier of the Reply Followup that has failed to be processed. Only required for `reply` and `template_reply` actions. |
| `reason`        | Optional human readable reason why the Ticket Action has failed. |
