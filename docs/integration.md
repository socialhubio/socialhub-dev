---
id: integration
title: Integration Paths
sidebar_label: Integration
---

The following describes the usual workflows followed in order to integrate a Network that is not officially supported by SocialHub yet.

- "Customer" is referring to customers of SocialHub. It is the group of administrators managing a SocialHub Account.
- "Developer" is referring to a person, department or agency responsible for the development of the Integration software. This is usually a either an in-house effort of the Customer's company or a contracted software development agency.

## A) Custom Channel

For Integrations specific to a single Customer using a Custom Channel is the simplest solution:

1. Customer creates a [Custom Channel](https://socialhubio.zendesk.com/hc/en-us/articles/360015917114-Inbox-API-Einrichtung-und-technische-Dokumentation).
1. Result of the creation is an "Access Token" which the Customer passes on to the Developer responsible for the development of the Integration.
1. The Customer should also provide the Developer with other credentials or permissions required to integrate the target Network.
1. The Developer may contact SocialHub Support in order to receive a test account where the implementation can be tested before being used in the Customers real Account.
1. After the Integration has been successfully implemented, the Customer should now be able to (depending on the capabilities provided by the Networks APIs) receive Inbox Tickets and answer them.

## B) Reusable Manifest

By default there's a 1-1 relationship between a Custom Channel and its Manifest. But if the Integration has been implemented in a manner that allows other Customers of SocialHub to make use of it, then a Manifest may be promoted to a "Reusable Manifest". The Manifest will be given a name and with this it may appear as an option on the Channels Settings Page allowing Customers to add the newly integrated Network just like one that is officially supported by the SocialHub Platform. These Channels will be created based on the Manifest which means that one Manifest may be referenced by multiple Channels controlling their Network specific configuration.

The workflow for adding new Channels of the custom made Network Integration would look like this:
1. The Developer adjusted their Integration implementation according to the documentation below.
1. The SocialHub Team reviews the Integration and may promote it to become reusable by other Customers.
1. Other Customers may be able to see the Integration in the list of Networks available to add on the Channels Settings Page
1. Customers can click on the "Add Channel" button belonging to the custom Integration leading them to an authentication-flow web page belonging to the Integration software.
1. After the Customer has successfully authenticated the Integration with the Network, they should be redirected back to the Channels Settings Page with the newly created Channel(s) now being active.

### Promotion requirements

The Integration must be adjusted in order to support being promoted to a Reusable Manifest allowing it create Channels for multiple SocialHub customers.

* The Manifest must have an URL set for [`callbacks.channelCreation`](general/manifest-api#channel-creation). Customers will be redirected to this URL when clicking on "Add Channel".
* The Integration must have a publicly reachable (under the configured `callbacks.channelCreation` URL) web page which will be passed a temporary access token as `token` query parameter. This token can only be used to create Custom Channels.
* After the Customer has authenticated the Integration with the Network it should [create Channel(s) via the `POST /channels` route](general/channel-api#creating-channels) using the token passed to it on redirect.
* The response of the Channel creation request will return a `endpoint.accessToken`. This Token is specific to the created Custom Channel should be stored by the Integration and used for further requests (eg. creating Tickets for the new Channel).

### Promotion consequences

* The Manifest will get a name set by the SocialHub Team which is used to display it as an available Network on the Channels Settings Page.
* The `PATCH /manifest` API route will longer be usable to change or retrieve Manifest information. Changes must be requested by contacting the SocialHub Team.
* The `GET /` API route will no longer return Manifest information.
