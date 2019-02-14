import {
	IMessage,
	IOption,
	ISuggestion,
	ResponseTerminationType,
	IContext
} from '../responseBuilders/IResponseBuilder';
import { IAgent } from './IAgent';
import { Response, DialogflowConversation, Carousel, BasicCard, List, Suggestions } from 'actions-on-google';

/** Limits and specifications imposed by Google Assistant */
const MAX_CHAT_BUBBLE = 2;
const MAX_CHARS_PER_CHAT_BUBBLE = 640;
const MAX_SUGGESTIONS = 8;
const MAX_CAROUSEL_CARDS = 10;
const MAX_LIST_CARDS = 30;
export const MESSAGE_DELIMITER = '  \n';

export class AoGAgent implements IAgent {
	private outputResponses: Response[] = [];
	constructor(private client: DialogflowConversation) {}

	sendResponses(responseType: ResponseTerminationType) {
		switch (responseType) {
			case ResponseTerminationType.Normal:
				this.client.ask(...this.outputResponses);
				break;
			case ResponseTerminationType.Final:
				this.client.close(...this.outputResponses);
				break;
		}
	}

	pushMessages(...messages: IMessage[]) {
		const m = AoGAgent.reduceMessages(messages);
		this.outputResponses.push(...m.map(message => message.message));
	}

	pushSuggestions(...suggestions: ISuggestion[]) {
		const s = suggestions.slice(0, MAX_SUGGESTIONS);
		this.outputResponses.push(new Suggestions(suggestions.map(suggestion => suggestion.suggestion)));
	}

	pushCards(...options: IOption[]) {
		options.forEach(option => {
			this.outputResponses.push(
				new BasicCard({
					title: option.title,
					text: option.description
				})
			);
		});
	}

	pushCarousel(...options: IOption[]) {
		if (options.length > MAX_CAROUSEL_CARDS) this.pushList(...options);
		else {
			const out = AoGAgent.toCard(options);
			this.outputResponses.push(new Carousel(out));
		}
	}

	pushList(...options: IOption[]) {
		const o = options.slice(0, MAX_LIST_CARDS);
		this.client.data['currentOptions'] = options.slice(MAX_LIST_CARDS); // I have no idea why we need this line
		const out = AoGAgent.toCard(o);
		this.outputResponses.push(new List(out));
	}

	pushContexts(...contexts: IContext[]) {
		contexts.forEach(context => {
			this.client.contexts.set(context.name, context.lifespan);
		});
	}

	/**
	 * converts options into cards for displaying in the chat
	 * @param options the options to be converted
	 */
	private static toCard(options: IOption[]) {
		const out = {};
		options.forEach(
			option =>
				(out[option.key] = {
					title: option.title,
					description: option.description,
					optionInfo: {
						key: option.key
					}
				})
		);
		return { items: out };
	}

	/**
	 * splits messages to meet restrictions by google if possible
	 * @param messages the messages for the conversation
	 */
	private static reduceMessages(messages: IMessage[]): IMessage[] {
		const n = messages.length;
		// add rounded up if not overflow
		if (n > MAX_CHAT_BUBBLE) {
			const delimiterLen = MESSAGE_DELIMITER.length;
			let currentCharacterCount = 0;
			let currentIndex = 0;
			let lastIndex = n - MAX_CHAT_BUBBLE;
			const msg: IMessage[] = [{ message: '' }];
			messages.forEach((message, i) => {
				const len = message.message.length;
				if (currentCharacterCount + len + delimiterLen < MAX_CHARS_PER_CHAT_BUBBLE && i <= lastIndex) {
					msg[currentIndex].message += MESSAGE_DELIMITER + message.message;
					currentCharacterCount += len + delimiterLen;
				} else {
					++currentIndex;
					currentCharacterCount = len;
					msg[currentIndex] = { ...message };
					if (i <= lastIndex) ++lastIndex;
				}
			});
			return msg.slice(0, MAX_CHAT_BUBBLE);
		}
		return messages;
	}
}
