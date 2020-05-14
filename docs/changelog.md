---
id: changelog
title: SocialHub API Changelog
sidebar_label: API Changelog
---

⚠ Consider subscribing to our [**API Newsletter**](http://eepurl.com/g2EiC1) to be notified about upcoming API changes in the future.

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
