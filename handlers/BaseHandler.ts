import { IResponseBuilder, ResponseTerminationType } from '../responseBuilders/IResponseBuilder';
import { IActionHandler } from './IActionHandler';
import { ActionHandlerPackage } from './ActionHandlerPackage';
import ResponseBuilderFactory from '../responseBuilders/ResponseBuilderFactory';

/**
 * The basic implementation of an action handler
 */
export abstract class BaseHandler implements IActionHandler {
	/** The object containing all required data sources and tools to complete and send the response */
	package: ActionHandlerPackage;

	/**
	 * Initialize this action handler.
	 * @param handlerPackage The package the action handler will use.
	 * @returns This initialized IActionHandler.
	 */
	init(handlerPackage: ActionHandlerPackage): Promise<IActionHandler> {
		console.log('called init');
		this.package = handlerPackage;
		return Promise.resolve(this);
	}

	/**
	 * Build the response that is specific to the individual implementation of action handler.
	 * @returns Whether or not this message should end the conversation.
	 */
	abstract buildResponse(responseBuilder: IResponseBuilder): Promise<ResponseTerminationType>;

	/**
	 * Build the response that will be sent to the user.
	 */
	respond(): Promise<void> {
		console.log('called respond');
		const responseBuilder = ResponseBuilderFactory.getResponseBuilder();
		return this.buildResponse(responseBuilder).then(responseType =>
			responseBuilder.respond(this.package, responseType)
		);
	}
}
