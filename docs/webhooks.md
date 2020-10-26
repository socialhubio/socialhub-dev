---
id: webhooks
title: WebHooks
sidebar_label: WebHooks
---

WebHooks allow receiving information about events that happened on SocialHub in near real time, without the need of continuously polling an API for changes.

## Registration

In order to use a WebHook it needs to be registered in the Manifest. This is done by updating the Manifest of the Custom Channel the Access Token belongs to, via the following REST API Route:

```bash
PATCH /manifest

{
  "webhook": {
    "url": "https://socialhub.example.com/webhook",
    "secret": "random_32_or_more_chars_long_string"
  }
}
```

Note that when updating the WebHook configuration, a test-request will be sent to verify the WebHook's authenticity. Therefore the verification needs to be implemented before registering the WebHook as described below.

The test-request is a HTTP POST request to the specified URL, as are all WebHook requests, with the only difference that the test-request will have an empty `events` object, as shown in [Event Processing](#event-processing). The response to the test-request should be HTTP 200 OK with an empty body (a correct challenge header must be returned though), see [Event Delivery Error Handling](#event-delivery) for more information.

The WebHook URL is required to support the HTTPS protocol with a valid SSL certificate to ensure all API communication is encryted. You can use [Let's Encrypt](https://letsencrypt.org/) to obtain free SSL certificates for your Integration.

In order to remove a configured WebHook, simply send the same PATCH-request with null (`{ "webhook": null }`).

## Verification

Requests sent to the configured WebHook will be signed with the secret using the SHA256 hashing algorithm.
The signature allows a WebHook to ensure a request actually came from SocialHub and can be trusted.
Signature related data is provided within the requests headers:
- `X-SocialHub-Timestamp`: Request timestamp in milliseconds.
- `X-SocialHub-Signature`: Request signature hash.

SocialHub expects a WebHook's responses to have a `X-SocialHub-Challenge` header to verify that the WebHook can be trusted.

#### Process

The following steps should be taken to verify an incoming request before processing the event data:

1. Generate a SHA-256 hash with the contents of the `X-SocialHub-Timestamp` and the configured secret concatenated with a `;` in between. This is also the challenge hash that should be returned in the response as `X-SocialHub-Challenge` header value.
2. Generate a HMAC SHA-256 hash with the request body while using the challenge hash as key. This is the same signature SocialHub calculates for each WebHook request.
3. Compare the generated signature with the signature received with the `X-SocialHub-Signature` header.

For more details take a look at some [code examples](misc/signature-code-examples).

## Event Processing

The request body sent to a configured WebHook will always have the following structure:

```json
{
  "manifestId": "5c9c01952bdfd718307a0a52",
  "accountId": "5c9b6b2a58a855074d1d278f",
  "channelId": "5c9c01952bdfd718307a0a53",
  "events": {}
}
```

The `events` object will only be empty during test-requests made when the WebHook is initially configured in the Manifest. Otherwise it will be a map of event-types with each a list of events of the same type.

```javascript
{
  "manifestId": "5c9c01952bdfd718307a0a52",
  "accountId": "5c9b6b2a58a855074d1d278f",
  "channelId": "5c9c01952bdfd718307a0a53",
  "events": {
    "ticket_action": [
      { /* ticket_action event 1 data... */ },
      { /* ticket_action event 2 data... */ },
      { /* ticket_action event 3 data... */ }
    ],
    "channel_action": [
      { /* channel_action event 1 data... */ }
    ]
  }
}
```

While it's possible that multiple events will be delivered at the same time, each request will only contain events belonging to a specific channel.

After having validated that the request really came from SocialHub and setting the challenge response header, the HTTP response should be immediately returned to SocialHub and the WebHook should continue processing the events asynchronously. A WebHook is not expected to return anything in its response body but any response contents returned anyway (eg. debugging information) must be application/json.

To process the events, first iterate over the keys of the `events` object and then call a responsible event handler for each of the field's array elements. Events that do not have an appropriate handler implemented, should be logged and silently discarded by the WebHook.

## Error Handling

### Event Delivery

If a WebHook responds with a HTTP Code higher than 2xx, SocialHub assumes that the delivery of the events has failed and may retry sending them a few more times. If SocialHub is unable to deliver the events even after several retries, they will be discarded.

Was the HTTP Response Code a success (2xx) but the `X-SocialHub-Challenge` response header is missing or incorrect, the events will be considered to have failed to be delivered and the WebHook configuration will be removed from the Manifest assuming that the WebHook is no longer trustworthy to receive further data.

### Manifest API response

Also take note of possible [Manifest API responses](general/manifest-api#responses).