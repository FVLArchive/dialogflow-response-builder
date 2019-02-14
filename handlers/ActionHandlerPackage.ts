import { WebhookClient } from 'dialogflow-fulfillment';
import { DialogflowConversation } from 'actions-on-google';
import { IAgent } from '../agents/IAgent';
import { AoGAgent } from '../agents/AoGAgent';
import { WebhookAgent } from '../agents/WebhookAgent';

export class ActionHandlerPackage {
	/**
	 * The instance of Dialogflow App that is used throughout the function call. Used with the V2 dialogflow API.
	 *
	 * @type {WebhookClient}
	 * @memberof IActionHandlerPackage
	 */
	webhookClient: WebhookClient = null;
	/**
	 * The actions-on-google client
	 *
	 * @type {DialogflowConversation}
	 * @memberof IActionHandlerPackage
	 */
	aogClient: DialogflowConversation = null;
	/**
	 * Intent parameters
	 *
	 * @type {*}
	 * @memberof IActionHandlerPackage
	 */
	parameters: any = null;

	getAgent(): IAgent {
		if (this.aogClient) return new AoGAgent(this.aogClient);
		else if (this.webhookClient) return new WebhookAgent(this.webhookClient);
		return null;
	}
}
