---
id: rest
title: REST APIs
sidebar_label: REST
---

SocialHub has REST-like APIs that allow create, read, update and delete (CRUD) operations to be executed on entities via simple HTTP requests.

## Usage

All REST APIs described in this documentation are sub-routes of the following URL:

```bash
https://api.socialhub.io/
```

All API requests should always be made using the HTTPS protocol. Any requests made via the plain text HTTP protocol will be responded with a permanent redirect header.

For simplicity, other pages of this documentation will use relative API location descriptors assuming that this URL would always be prefixed in practical use.

The APIs expect to receive request contents encoded as `application/json` and will return response contents encoded as `application/json`.

## Reference

For quickly looking up information about the API and testing it without code, we have created a    
[**Swagger API Specification**](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/socialhubio/socialhub-dev/master/swagger.yaml).

## Authentication

All requests made are authenticated by a query parameter called `accesstoken`. The value is a Json Web Token (JWT) that is restricted to a specific channel and can be obtained during creation or when editing a Custom Channel on the Channel Settings page.

```
/?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1YzliNmIyYTU4YTg1NTA3NGQxZDI3OGYiLCJjaGFubmVsSWQiOiI1YzljMDE5NTJiZGZkNzE4MzA3YTBhNTMiLCJpYXQiOjE1NTQxMzQ1NDF9.mXomId0-stW1l4QQQkjeBflo74ZIHzd0-Xj_71VyncA
```

JWTs can be decoded (eg. with the online decoder at [jwt.io](https://jwt.io/)) and do not have an expiration date.

```javascript
{
  "accountId": "5c9b6b2a58a855074d1d278f",  // Id of the account the token belongs to
  "channelId": "5c9c01952bdfd718307a0a53",  // Id of the channel the token is restricted to
  "iat": 1554134541 // Timestamp in seconds of when the token was issued
}
```

Access Tokens can be invalidated effective immediately at any time via the Custom Channel settings "Create new Token" Button. This will cause all further requests made using the previous token to fail permanently and disables any configured WebHook in the Channel's Manifest.

## Root Route

The route at the API's root path is intended to return some basic information for the given JWT.

```bash
curl "https://api.socialhub.io/?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1YzliNmIyYTU4YTg1NTA3NGQxZDI3OGYiLCJjaGFubmVsSWQiOiI1YzljMDE5NTJiZGZkNzE4MzA3YTBhNTMiLCJpYXQiOjE1NTQxMzQ1NDF9.mXomId0-stW1l4QQQkjeBflo74ZIHzd0-Xj_71VyncA"
```

```javascript
{
  "channel": {
    "_id": "5e73f56c5a45da10b6e614de",
    "name": "Test",
    "uniqueName": "test",
    "accountId": "5e73f5245a45da10b6e614d8",
    "updatedTime": "2020-05-05T23:16:05.451Z",
    "businessHours": null,
    "createdTime": "2020-03-19T22:42:52.154Z"
  },
  "manifest": {
    "_id": "5e73f56c5a45da10b6e614dd",
    "inbox": {
      "ticketActions": [
        {
          "label": "Comment",
          "id": "comment",
          "type": "reply"
        }
      ]
    }
  }
}
```

Note that the `manifest` field is omitted for Reusable Manifests.

More information about the objects returned here can be found in their respective API documentations.

## Error handling

The following responses of the SocialHub REST APIs are common for all routes and should be handled by the Integration's client:

#### `HTTP 401 Unauthorized`

```json
{
 "code": "AccessTokenInvalidError",
 "message": "Error: Invalid access token"
}
```

The JWT you specified as `accesstoken` within your request is missing or (has become) invalid. Contact an Administrator of the SocialHub Account the Channel belongs to and refrain from further attempts with the same token.

#### `HTTP 403 Forbidden`

```json
{
 "code": "ChannelDeactivated",
 "message": "Error: Channel is deactivated"
}
```

The Custom Channel has been disabled, most likely by an Administrator of the Account. Please contact them and refrain from further requests until the channel has been re-activated.

#### `HTTP 429 Too Many Requests`

```json
{
 "code": "TooManyRequestsError",
 "message": "Error: Too many requests."
}
```

There have been too many request to this route for the Channel your access token belongs to. Please refrain from further requests until you have been unblocked. Check the `Retry-After`-HTTP-Header to find out when you'll be able to continue using the API.

The following HTTP Headers are always returned to allow you to throttle requests if necessary:
```yaml
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
```

Rate limiting is scoped to a Channel and not to your specific Client. If you are sure your Client is not responsible for reaching the limit, there might be another Program doing to many requests to the same Channel. You might want to contact the Administrator of the Account the Channel belongs to to find out more.
