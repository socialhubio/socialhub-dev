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
    "secret": "a_random_secret_string"
  }
}
```

Note that when updating the WebHooks configuration, a test-request will be send to verify the WebHook's authenticity. Therefore the verification needs to be implemented before registering the WebHook as described further below.

The WebHook URL is required to support the HTTPS protocol with a valid SSL certificate to ensure all API communication is encryted. You can use [Let's Encrypt](https://letsencrypt.org/) to obtain free SSL certificates for your Integration.

In order to remove a configured WebHook, simply send the same PATCH-request with an empty configuration object (`{ "webhook": {} }`).

## Verification

Requests send to the configured WebHook will be signed with the secret using the SHA256 hashing algorithm.
The signature allows a WebHook to ensure a request actually came from SocialHub and can be trusted.
Signature related data is provided within the requests headers:
- `X-SocialHub-Timestamp`: Request timestamp in milliseconds.
- `X-SocialHub-Signature`: Request signature hash.

SocialHub expects a WebHook's responses to have a `X-SocialHub-Challenge` header to verify that the WebHook can be trusted.

### Example

The following is an example on how a WebHook would verify an incoming request before processing the event data.
PHP was used due to its simplicity in showing how verification works, but it can be implemented in any other language.

```php
// Optional: Prevent replay attacks by ensuring this request has been signed
// recently (+/- 5 minutes). The request timestamp is in ms!
$req_timestamp = $_SERVER['HTTP_X_SOCIALHUB_TIMESTAMP'];
$req_age = abs(time() - intval($req_timestamp)/1000);
if ($req_age > 300) die('Invalid request timestamp');

// Calculate challenge hash by concatenating the request timestamp with the
// webhook secret with a semicolon in between: "timestamp;secret".
// Hash is created with SHA256 encoded as hexdecimal lowercase string.
$secret = 'a_random_secret_string';
$challenge = hash('sha256', $req_timestamp . ';' . $secret);

// Calculate request body signature using the challenge hash as secret.
// Signature is a HMAC SHA256 hash encoded as hexdecimal lowercase string.
$req_raw_body = file_get_contents('php://input');
$expected_signature = hash_hmac('sha256', $req_raw_body, $challenge);

// Compare expected with received signature.
$req_signature = $_SERVER['HTTP_X_SOCIALHUB_SIGNATURE'];
if ($expected_signature !== $req_signature) die('Invalid signature');

// Add solved challenge to response.
header('X-SocialHub-Challenge: ' . $challenge);

// Parse the JSON request body and process the received events.
// ...
```

## Event Processing

The request body send to a configured WebHook will always have the following structure:

```json
{
  "manifestId": "5c9c01952bdfd718307a0a52",
  "accountId": "5c9b6b2a58a855074d1d278f",
  "channelId": "5c9c01952bdfd718307a0a53",
  "events": {}
}
```

The `events` object will only be empty during test-requests made when the WebHook is initially configured in the Manifest. Otherwise it will be a map of event-types with each a list of events of the same type.

```json
{
  "manifestId": "5c9c01952bdfd718307a0a52",
  "accountId": "5c9b6b2a58a855074d1d278f",
  "channelId": "5c9c01952bdfd718307a0a53",
  "events": {
    "ticket_action": [
      { ticket_action event 1 data... },
      { ticket_action event 2 data... },
      { ticket_action event 3 data... }
    ],
    "channel_action": [
      { channel_action event 1 data... }
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

The following error responses of the SocialHub Manifest API should the handled by the Integration's client:

#### `HTTP 422 Unprocessable Entity`

```json
{
  "code": "WebhookValidationError",
  "message": "Error: An error occurred while attempting to validate the WebHook",
  "data": "Error: getaddrinfo ENOTFOUND socialhub.example.com socialhub.example.com:443"
}
```

Is returned whenever the URL specified in the Manifest is not reachable by the HTTPS test request. The `data` value is the internal error that occurred when the test was attempted and should help debugging the issue.

```json
{
  "code": "WebhookValidationError",
  "message": "Error: The WebHook failed to solve the challenge"
}
```

It's also possible that we were able to execute the HTTPS request but the response did not contain a valid challenge response header.
