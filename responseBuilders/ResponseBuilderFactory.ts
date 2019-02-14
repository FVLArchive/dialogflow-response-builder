import { IResponseBuilder } from './IResponseBuilder';
import { DefaultResponseBuilder } from './defaultResponseBuilder';

export default class ResponseBuilderFactory {
	static getResponseBuilder(): IResponseBuilder {
		return new DefaultResponseBuilder();
	}
}
