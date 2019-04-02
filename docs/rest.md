---
id: rest
title: REST API
sidebar_label: REST
---

SocialHub has REST-like APIs that allow create, read, update and delete (CRUD) operations to be executed on entities via simple HTTP requests.

## Usage

All REST APIs described in this documentation are sub-routes of the following URL:

```bash
https://app.socialhub.io/api2/public/
```

All API requests should always made using the HTTPS protocol. Any requests made via the plain text HTTP protocol will be responded with a permanent redirect header.

For simplicity, other pages of this documentation will use relative API location descriptors assuming that this URL would always be prefixed in practical use.

The APIs expect to receive request contents encoded as `application/json` and will return response contents encoded as `application/json`.

## REST-like Design

The APIs try to follow the REST patterns and best practices as closely as it makes sense. Generally you can assume the following patterns apply to the APIs:

- `POST /entities`    
  Will create a new object of type entity as specified in the request body and respond with HTTP 201 Created and the full newly created object as response body
- `GET /entities`    
  Will return a list of entity objects as array and respond with HTTP 200 OK
- `GET /entities/1`    
  Will return an entity object identified with id: `1` and respond with HTTP 200 OK
- `PUT /entities/1`    
  Will replace the entity object (id: `1`) with a new one specified in the request body and respond with HTTP 200 OK and the updated object as response body
- `PATCH /entities/1`    
  Will partially update the entity object (id: `1`) with values specified in the request body and respond with HTTP 200 OK and the updated object as response body
- `DELETE /entities/1`    
  Will delete the entity object (id: `1`) and respond with HTTP 204 No Content without any response body
- `POST /entities/1/action`    
  Will apply an action to the entity object (id: `1`) and respond with HTTP 200 OK and action related data in the response body

## Reference

For quickly looking up and testing without code, we have created a [Swagger API Reference](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/socialhubio/socialhub-dev/master/swagger.yaml).

## Authentication

All requests made are authenticated by a query parameter called `accesstoken`. The value is a Json Web Token (JWT) that is restricted to a specific channel and can be found when editing a Custom Channel on the Channel Settings page.

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
