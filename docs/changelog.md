---
id: changelog
title: SocialHub API Changelog
sidebar_label: API Changelog
---

⚠ Consider subscribing to our [**API Newsletter**](http://eepurl.com/g2EiC1) to be notified about upcoming API changes in the future.

## Version 1.10

The following changes to the API are scheduled to be deployed in **calendar week 7**. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.
### New: additional characters for networkItemId

The allowed characters for the networkItemId was expanded. Allowed pattern as regular expression: `^[a-zA-Z0-9\/|@&$!?\()[\]{}+*~,;.:=_-]{6,256}$`.  
All already existing networkItemIds stay valid.

## Version 1.9

The following changes to the API are scheduled to be deployed in **calendar week 3**. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: Ticket Reply Options

Ticket replies can now have dropdown options. If options are defined in the manifest, a user has to select one of them before creating a reply. The selected option id would be sent to the Integration as part of the payload. More information is available in the [swagger API Reference](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/socialhubio/socialhub-dev/master/swagger.yaml), [Tickets API](inbox/ticket-api#updating-tickets) and [Manifest](general/manifest-api#inboxticketactionsoptions) documentations.

## Version 1.8

The following changes to the API are scheduled to be deployed in **calendar week 50**. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: Updating Tickets

A new API route was added that allows updating Inbox Tickets after creation. Its specification is mostly the same as the creation route with a few quirks. For example you can use the "reset" query parameter to move Tickets out of the Done folder after updating them. You can find details in the swagger file and on the [Tickets API documentation](inbox/ticket-api#updating-tickets).

## Version 1.7

The following changes to the API are scheduled to be deployed in **calendar week 46**. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: Reply Attachments

It's now possible that a Ticket Action of type `reply` may have attachments. To control whether it's possible to specify attachments for a Reply simply set `attachments: {}` on the Ticket Action definition in the [Manifest](general/manifest-api#request). At a later point you'll be able to specify a file schema to control what kind of attachments are allowed – for now there is no restriction an all checks should happen on the Integration's end.  
We also introduced the `attachments: { noText: true }` option, which allows you to prevent creating replies with a text and an attachment at the same time.

If SocialHub user triggers `reply` action with attachments, webhook payload would contain `attachments` array with related metadata. Check out [Reply Action Event](inbox/ticket-api#ticket-action-type-reply) for more information.

### New: Ticket Types

It's now possible to specify a Ticket Type when [creating Tickets](inbox/ticket-api#interaction) and [confirming replies](inbox/ticket-api#reply-success-confirmation) for Channels of reusable Manifests. For non-reusable Manifests it will be set to `TICKET` by default. See the [Swagger API](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/socialhubio/socialhub-dev/master/swagger.yaml) specification for more information about which Types are available.

## Version 1.6

The following changes to the API are scheduled to be deployed in **calendar week 36**. Note that some of these changes are breaking previous behavior. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: Network Branding

It's now possible to define Network specific branding within the [Manifest](general/manifest-api#request) such as icons and color schemes.

### New: Ticket Link

Now it is possible to include a shared link while [creating a new Ticket](inbox/ticket-api#creating-tickets). This link would be clickable in the SocialHub interface.

### Breaking Change: `networkId` moved out of `channel.endpoint`

The `networkId` is now a top level attribute of channels and no longer part of the `endpoint` subobject.  
All existing channels will be migrated and the `networkId` is automatically moved out of the `endpoint`.  
[Creating new channels](general/channel-api#creating-channels) requires the `networkId` to be provided as top level attribute.

### New: Optional reason of channel deactivation

`DELETE /channel` route now supports optional query parameter - `reason`. `reason` should be a string describing why the channel was deactivated (e.g. `Access token expired`). The `reason` will be saved internally in the SocialHub and at the moment is mostly used for debug purposes.

## Version 1.5

The following changes to the API are scheduled to be deployed in **calendar week 33**. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: `flatListWithRoot` Inbox Right Sidebar tree builder

A new type of tree builder is available for the Inbox Right Sidebar - `flatListWithRoot`. This tree builder builds a flat list of Tickets using common Root Ticket. The Root Ticket is included in the list and have some action buttons in the UI. More information can be found on [Manifest API](general/manifest-api#inboxrightsidebar) page.

## Version 1.4

The following changes to the API are scheduled to be deployed in **calendar week 31**. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: Channel User Authentication Information

On the new and refactored SocialHub Channels Settings page, users will be able to easily identify what Network Users were used to add a Channel (authenticate it) with SocialHub. For example for Facebook, it will show the Facebook Users that were used to add each Channel (Facebook Page). To allow custom Integrations, that use the Public API to integrate Networks, to provide such User Information as well, a new field `user` has been added to the `endpoint` field in the [Channel API](general/channel-api#updating-channels). 

## Version 1.3

The following changes to the API are scheduled to be deployed in **25th June**. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: Approval Process support

The SocialHub Inbox "Approval Process" feature now also works for Custom Channels. Previously it was not possible to suggest replies for Tickets of Custom Channels and have them approved by another SocialHub user. This has now been changed to work the same way as for normal Social Networks. Note that the Approval Process is currently only available for `reply` and `template_reply` Ticket Actions, not for non-reply actions such as `button`.

### New: `approvalProcess` Ticket Action configuration

A new Ticket Action configuration flag has been added for `reply` and `template_reply` Actions to the [Manifest API](general/manifest-api#inboxticketactions). With it you can control whether your Ticket Action needs to be approved when the SocialHub Account has the Approval Process feature enabled, which is the default behavior. If you want to ensure that the Approval Process is skipped for your Ticket Action, set `approvalProcess` to `false` in the Ticket Action's configuration.

Note that in order to maintain consistent behavior up to this point, Ticket Actions of existing Manifests have been migrated to be `approvalProcess: false` by default. If you wish to enable the Approval Process for your existing Manifests, simply unset the field or set it to `true` using the Manifest API.

## Version 1.2

The following changes to the API have been deployed on the **10th June**. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: `button` Ticket Action

A new Ticket Action type `button` is now available to be defined within [Manifests](general/manifest-api#inboxticketactions). When having defined a `button` Ticket Action within your Manifest, all Tickets of your Custom Channel will have a simple button which can be used to implement actions such as "Like" and "Share". More information about how the event payload looks like can be found on the [Ticket API documentation](inbox/ticket-api#ticket-action-type-button).

## Version 1.1

The following changes to the API are scheduled to be available from **17th May**, some have already been deployed. As all of these changes are **New** additions to existing behavior, there should be no action required by Developers. The impacted documentation pages and swagger specifications have already been updated accordingly.

### New: Channel Reactivation Callback

A new callback URL is available for Reusable Manifests: `callbacks.channelReactivation`.

Similar to the `callbacks.channelCreation` URL, where Customers will be redirected to when clicking on the "Add Channel" Button, Customers will be redirected here in order to reactivate Channels that have been disabled.

See the [Manifest API](general/manifest-api#channel-reactivation) documentation for more information.

### New: Update and Delete Channel API routes

New API routes for updating and disabling Channels have been added.

See the [Channel API](general/channel-api#updating-channels) documentation for more information.

### New: Channel Network Identifiers

A new field can be set during Channel creation for Reusable Manifests: `endpoint.networkId`.

See the [Channel API](general/channel-api#endpoint) documentation for more information.

This will help reactivating specific Channels by their unique identifier instead of their unique name. Additionally it allows the Tickets API to identify and hide interactions that have most likely been caused by the Customer that owns the Channel.

### New: Ticket Interactors

It's now possible to specify Interactors during Ticket creation. An Interactor is a collection of information about the person that caused the Interaction on the network. If, for example, the Interaction is a Facebook Comment then the Interactor would be the Facebook User who created the comment. When the same Interactor identifier is used in multiple Tickets, these Tickets will be automatically linked in order to build a user history for the right sidebar. 

If the identifier of the Interactor matches the Channel's `endpoint.networkId` the Ticket will not be created as an unread Ticket in the Inbox. Because we assume that in that case the Interactor was the Customer owning the Channel and the Customer most likely does not need to work on a Ticket that was created by themself. Therefore it'll be hidden from the Inbox except when displaying a Ticket Tree in the right sidebar or for the post-based Inbox.

See the [Ticket API](inbox/ticket-api#interactioninteractor) documentation for more information.

### New: Root-Tickets

It's now possible to specify Root-Tickets during Ticket creation. By specifying a Root-Ticket ID, multiple Tickets can be linked together into a flat tree, which can then be displayed in the right sidebar.

See the [Ticket API](inbox/ticket-api#interactionroot) documentation for more information.

### New: Inbox Right Sidebar configuration

It's now possible to configure right sidebars within the Manifest. Tree builders can be used to specify how linked Tickets are displayed in the right sidebar after selecting a Ticket in Inbox.

At this moment there is only one tree builder algorithm available: `flatListWithoutRoot` which simply displays all Tickets in the right sidebar that share the same Root-Ticket.

See the [Manifest API](general/manifest-api#inboxrightsidebar) documentation for more information.

### New: Template Reply Ticket Action

A new Ticket Action called `template_reply` has been added. This form of reply does not allow free text but instead only allows Customers to fill out specific variables who's values are checked against a schema for validity.

To use it you first have to configure the Ticket Action with the [Manifest API](general/manifest-api#inboxticketactions) and implement a [publicly reachable route](general/manifest-api#templates) where available Templates can be fetched from. After that you will receive Ticket Action events as described in the [Ticket API](inbox/ticket-api#ticket-action-type-template-reply) documentation.

### New: Ticket Action Timeouts

Ticket Actions now have an optional configuration value for setting timeouts. This means that for each action you can specify a timeout time range after which the Ticket Action may no longer be used by the Customer. Currently the time range begins with the interaction creation time of the Ticket.

See the [Manifest API](general/manifest-api#inboxticketactions-configtimeout) documentation for more information.

### New: Ticket Ratings

Ratings (eg. star-ratings from reviews) can now be stored within the Interaction of Tickets.

See the [Ticket API](inbox/ticket-api#interactionrating) documentation for more information.

### New: API Root Route

A new route is available at the root path of the API returning basic information for a given JWT.

See the [REST Documentation](rest#root-route) for more information.
