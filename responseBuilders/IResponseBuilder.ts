import { ActionHandlerPackage } from '../handlers/ActionHandlerPackage';

export interface IMessage {
	message: string;
}

export interface IOption {
	title: string;
	description: string;
	key: string;
}

export interface ISuggestion {
	suggestion: string;
}

export interface IContext {
	/**
	 * The name/id of the context
	 *
	 * @type {string}
	 * @memberof IContext
	 */
	name: string;
	/**
	 * The number of interactions this context will be effective for
	 *
	 * @type {number}
	 * @memberof IContext
	 */
	lifespan: number;
}

/**
 * Flags to indicate how to conclude the response; whether or not to end the conversation, etc.
 */
export enum ResponseTerminationType {
	Normal,
	Final
}

export interface IResponseBuilder {
	addMessages(...messages: IMessage[]): IResponseBuilder;

	addOptions(...options: IOption[]): IResponseBuilder;

	addSuggestions(...suggestions: ISuggestion[]): IResponseBuilder;

	addContexts(...contexts: IContext[]): IResponseBuilder;

	respond(actionHandlerPackage: ActionHandlerPackage, responseType: ResponseTerminationType): void;

	getMessages(): IMessage[];

	getOptions(): IOption[];

	getSuggestions(): ISuggestion[];
}
