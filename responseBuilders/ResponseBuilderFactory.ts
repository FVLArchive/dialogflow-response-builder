import { IResponseBuilder } from './IResponseBuilder';
import { DefaultResponseBuilder } from './defaultResponseBuilder';

function defaultGetResponseBuilder(): IResponseBuilder {
	return new DefaultResponseBuilder();
}
export default class ResponseBuilderFactory {
	// Override this function pointer to customize which response builder to return
	static getResponseBuilder: () => IResponseBuilder = defaultGetResponseBuilder;
}
