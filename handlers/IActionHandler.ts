import { ResponseTerminationType } from '../responseBuilders/IResponseBuilder';

export interface IActionHandler {
	// the type of action the handler performs, such as performing action on policy or claim
	/**
	 * Initializes the action handler.
	 * @param IActionHandlerPackage The already initialized package that this action handler will base the request off of.
	 * @returns This action handler
	 */
	init(IActionHandlerPackage): Promise<IActionHandler>;
	/**
	 * Performs all functionality required by the current request.
	 * Any messages to be displayed will be added to the provided response builder.
	 * Any information required will be taken from the package provided during initialization.
	 * @param IResponseBuilder All new messages will be appended to this response builder.
	 * @returns Whether this conversation should be continued or ended after the response.
	 */
	buildResponse(IResponseBuilder): Promise<ResponseTerminationType>;
	/**
	 * The primary method called to carry out all the handler's functionality as well as create and send the associated response
	 */
	respond(): Promise<void>;
}
