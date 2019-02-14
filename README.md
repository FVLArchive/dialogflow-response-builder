# Dialogflow Response Builder

This typescript, npm-package project provides a set of tools to help construct reponses in your Dialogflow fulfillment logic.
The `IResponseBuilder` abstraction normalizes responses to a set of response types that translates to various native types
based on the agent that is detected in the firebase fulfillment request.
Currently, Actions-on-Google (AoG) is a specific agent that is specifically supported; otherwise the fall back assumed to be a generic Webhook agent.

The supplied `defaultResponseBuilder` represents a vanilla brand for your responses. Build you own brand by designing your own response builder implementing `IResponseBuilder`. Branding includes the pattern, formatting, wording, etc. of response messages.

## Fulfillment handlers

There is also a `FulfillmentHandler` class to abstract away the process of invoking handlers based on the givent intent. Here is an example usage of `FulfillmentHandler` in a `Firebase functions` endpoint.

```js
import * as functions from 'firebase-functions';
import { FulfillmentHandler, IntentHandler } from '@fvlab/dialogflow-response-builder';
import { myHandler } from './handlers/myHandler'; // you provide this

// Define the intent-to-handler mappings
const intentHandlers: IntentHandler[] = [
  { intent: 'statistics.premium.byBroker', actionHandler: new myHandler() }
  // Add more intent to handler mappings here.
];

// This is the definition for the firebase (REST) endpoint that should be registered in your dialogflow project.
export const dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  new FulfillmentHandler(...intentHandlers).handleFulfillment(req, res);
});
```

## Action handlers

To build your action handlers just create classes that implement the `IActionHanlder` interface. There is also a `BaseHandler` class that you can inherit from to help with response building.
