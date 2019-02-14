/**
 * This module handles fulfillment requests. The branching approach is taken because the new AoG sdk does not
 * support other platforms yet, in the future, if the sdk is updated, this module could be updated to use
 * solely AoG sdk.
 */

import { Request, Response } from 'express';
import { dialogflow } from 'actions-on-google';
import { WebhookClient } from 'dialogflow-fulfillment';
import { ActionHandlerPackage } from './handlers/ActionHandlerPackage';
import { IActionHandler } from './handlers/IActionHandler';

const FAIL_MESSAGE = 'Failed, please try again.';

export class IntentHandler {
	intent: string;
	actionHandler: IActionHandler;
}

export class FulfillmentHandler {
	intentHandlers: IntentHandler[];

	constructor(...intentHandlers: IntentHandler[]) {
		this.intentHandlers = intentHandlers;
	}

	public handleFulfillment(req: Request, res: Response) {
		const source = req.body.originalDetectIntentRequest.source;
		if (!source || source === 'google') {
			return this.handleAoGCFulfillment(req, res);
		} else {
			return this.handleWebhookFulfillment(req, res);
		}
	}

	private handleAoGCFulfillment(req: Request, res: Response) {
		const app = dialogflow({ debug: true });
		app.fallback(conv => {
			console.log('Intent:', conv.intent);
			const handlerPackage = new ActionHandlerPackage();
			handlerPackage.aogClient = conv;
			handlerPackage.parameters = conv.parameters;
			return this.handle(conv.intent, handlerPackage);
		});
		return app(req, res);
	}

	private handleWebhookFulfillment(req: Request, res: Response) {
		const agent = new WebhookClient({
			request: req,
			response: res
		});
		const handlerPackage = new ActionHandlerPackage();
		handlerPackage.webhookClient = agent;
		handlerPackage.parameters = agent.parameters;
		console.log('Intent:', agent.intent);
		return agent.handleRequest(() => this.handle(agent.intent, handlerPackage));
	}

	private async handle(intent: string, handlerPackage: ActionHandlerPackage): Promise<void> {
		console.log('handling');
		const intentHandler = this.intentHandlers.find(x => x.intent === intent);
		if (intentHandler) {
			return intentHandler.actionHandler
				.init(handlerPackage)
				.then(handler => handler.respond())
				.catch(err => {
					console.error('Error while handling action:', err.stack);
					if (handlerPackage.webhookClient) handlerPackage.webhookClient.end(FAIL_MESSAGE);
					else if (handlerPackage.aogClient) handlerPackage.aogClient.close(FAIL_MESSAGE);
				});
		} else console.error(`Unhandled intent: ${intent}`);
	}
}
