import {
	IMessage,
	IOption,
	ISuggestion,
	ResponseTerminationType,
	IContext
} from '../responseBuilders/IResponseBuilder';
/**
 * Agent-traits to support a pluggable agent response handling.
 * This layer of abstration should really be handled by Dialogflow but it's not there yet.
 *
 * @export
 * @interface IAgent
 */
export interface IAgent {
	/**
	 * Prepare messages to be sent to the agent
	 *
	 * @param {...IMessage[]} messages
	 * @memberof IAgent
	 */
	pushMessages(...messages: IMessage[]);
	/**
	 * Prepare suggestions to be sent to the agent
	 *
	 * @param {...ISuggestion[]} suggestions
	 * @memberof IAgent
	 */
	pushSuggestions(...suggestions: ISuggestion[]);
	/**
	 * Prepare cards to be sent to the agent
	 *
	 * @param {...IOption[]} options
	 * @memberof IAgent
	 */
	pushCards(...options: IOption[]);
	/**
	 * Prepare a carousel to the sent to the agent
	 *
	 * @param {...IOption[]} options
	 * @memberof IAgent
	 */
	pushCarousel(...options: IOption[]);
	/**
	 * Prepare a list to be sent to the agent
	 *
	 * @param {...IOption[]} options
	 * @memberof IAgent
	 */
	pushList(...options: IOption[]);
	/**
	 * Prepare the context of the response to be sent to the agent
	 *
	 * @param {...IContext[]} contexts
	 * @memberof IAgent
	 */
	pushContexts(...contexts: IContext[]);
	/**
	 * send all the repsonse items to the agent
	 *
	 * @param {ResponseTerminationType} responseType
	 * @memberof IAgent
	 */
	sendResponses(responseType: ResponseTerminationType);
}
