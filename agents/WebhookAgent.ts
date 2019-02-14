import {
	IMessage,
	IOption,
	ISuggestion,
	ResponseTerminationType,
	IContext
} from '../responseBuilders/IResponseBuilder';
import { IAgent } from './IAgent';
import { WebhookClient, Card, Suggestion } from 'dialogflow-fulfillment';

/**
 * The basic webhook client which doesn't support carousels or lists.  These collections will be interpretted as Cards.
 *
 * @export
 * @class WebhookAgent
 * @implements {IAgent}
 */
export class WebhookAgent implements IAgent {
	private outputResponses: string[] = [];
	constructor(private client: WebhookClient) {}

	sendResponses(responseType: ResponseTerminationType) {
		switch (responseType) {
			case ResponseTerminationType.Normal:
				this.client.add(this.outputResponses);
				break;
			case ResponseTerminationType.Final:
				this.client.end(...this.outputResponses);
				break;
		}
	}

	pushMessages(...messages: IMessage[]) {
		this.outputResponses.push(...messages.map(message => message.message));
	}

	pushSuggestions(...suggestions: ISuggestion[]) {
		this.outputResponses.push(...suggestions.map(suggestion => new Suggestion(suggestion.suggestion)));
	}

	pushCards(...options: IOption[]) {
		this.outputResponses.push(
			...options.map(option => new Card({ title: option.title, text: option.description }))
		);
	}

	pushCarousel(...options: IOption[]) {
		this.pushCards(...options);
	}

	pushList(...options: IOption[]) {
		this.pushCards(...options);
	}

	pushContexts(...contexts: IContext[]) {
		contexts.forEach(context => {
			this.client.setContext({ name: context.name, lifespan: context.lifespan });
		});
	}
}
