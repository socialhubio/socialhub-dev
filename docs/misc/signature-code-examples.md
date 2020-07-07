---
id: signature-code-examples
title: Signature Verification Code Examples
sidebar_label: Signature Code Examples
---

The following are examples on how to implement signature verification for incoming WebHook requests.

## PHP

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

## NodeJS (expressjs middleware)

```javascript
const bodyParser = require('body-parser');
const moment = require('moment');
const crypto = require('crypto');

const verifySignature = (req, res, next) => {

  const {
    'x-socialhub-timestamp': reqTimestamp,
    'x-socialhub-signature': reqSignature,
  } = req.headers;

  if (!reqTimestamp || !reqSignature) {
    throw new InvalidSignature('SocialHub headers missing from request');
  }

  // Prevent replay attacks by ensuring this request has been signed
  // recently (+/- 5 minutes). The request timestamp is in ms!
  if (moment().diff(Number(reqTimestamp), 'minutes', true) > 5) {
    throw new InvalidSignature('Request timestamp is not valid');
  }

  // Calculate challenge hash.
  const challenge = crypto.createHash('sha256').update(`${reqTimestamp};${config.socialHub.manifestSecret}`).digest('hex');
  const hmac = crypto.createHmac('sha256', challenge);

  // Add payload to calculations
  // Middleware is used after body was parsed -> req.body will be set.
  if (req.body) {
    const payload = JSON.stringify(req.body);
    hmac.update(payload);
  }

  // Calculate signature
  const expectedSignature = hmac.digest('hex');

  // Compare expected with received signature.
  if (reqSignature !== expectedSignature) {
    throw new InvalidSignature('Request signature is not valid');
  }

  // Add solved challenge to response.
  // This will proof to SocialHub that we were the intended recipient.
  res.set('x-socialhub-challenge', challenge);
  
  next();
};

app.post('/webhook', bodyParser.json(), verifySignature, function (req, res) {
  processWebhookData(req.body);
});
```

## Python

This example has been contributed by [@luto](https://gist.github.com/luto)

```python
import hashlib
import hmac
import time

class SocialHubSignatureError(Exception):
    pass

class SocialHubSignatureTimestampError(SocialHubSignatureError):
    pass

def verify_webhook_signature(
    secret: str, req_timestamp: int, req_raw_body: bytes, req_signature: str,
    ignore_time: bool=False
) -> str:
    """
    Verify X-SocialHub-Timestamp / X-SocialHub-Signature headers in webook requests
    and return the challenge, which feeds into X-SocialHub-Challenge.

    Author: uberspace.de, 2020
    License: dual-licensed as CC-0 and MIT

    Specification: https://socialhub.dev/docs/en/webhooks
    """

    # variable names in this method are not very pythonic, but identical to
    # the ones in the PHP implementation. please keep them this way.

    assert type(secret) is str
    assert type(req_timestamp) is int
    assert type(req_raw_body) is bytes
    assert type(req_signature) is str

    secret = secret.encode('ascii')

    req_age = abs(time.time() - req_timestamp/1000)

    if req_age > 300 and not ignore_time:
        raise SocialHubSignatureTimestampError()

    challenge = hashlib.sha256(str(req_timestamp).encode() + b';' + secret).hexdigest()

    signature_hmac = hmac.new(challenge.encode(), digestmod=hashlib.sha256)
    signature_hmac.update(req_raw_body)
    expected_signature = signature_hmac.hexdigest()

    if req_signature != expected_signature:
        raise SocialHubSignatureError()

    return challenge
```