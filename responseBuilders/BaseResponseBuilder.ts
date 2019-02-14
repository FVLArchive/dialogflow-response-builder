import {
  IResponseBuilder,
  IMessage,
  IOption,
  ISuggestion,
  ResponseTerminationType,
  IContext
} from './IResponseBuilder';
import { ActionHandlerPackage } from '../handlers/ActionHandlerPackage';
import { IAgent } from '../agents/IAgent';

/**
 * A starting point for building responses with provision for customization to meet your communication guidelines and styles.
 *
 * @export
 * @abstract
 * @class BaseResponseBuilder
 * @implements {IResponseBuilder}
 */
export abstract class BaseResponseBuilder implements IResponseBuilder {
  protected options: IOption[] = [];
  protected suggestions: ISuggestion[] = [];
  protected contexts: IContext[] = [];

  addMessages(...messages: IMessage[]): IResponseBuilder {
    this.messages.push(...messages);
    return this;
  }

  addOptions(...options: IOption[]): IResponseBuilder {
    this.options.push(...options);
    return this;
  }

  addSuggestions(...suggestions: ISuggestion[]): IResponseBuilder {
    this.suggestions.push(...suggestions);
    return this;
  }

  addContexts(...contexts: IContext[]): IResponseBuilder {
    this.contexts.push(...contexts);
    return this;
  }

  protected messages: IMessage[] = [];
  getMessages(): IMessage[] {
    return this.messages;
  }
  getOptions(): IOption[] {
    return this.options;
  }
  getSuggestions(): ISuggestion[] {
    return this.suggestions;
  }

  respond(actionHandlerPackage: ActionHandlerPackage, responseType: ResponseTerminationType): void {
    const agent = actionHandlerPackage.getAgent();
    if (agent) {
      agent.pushContexts(...this.contexts);
      this.processCurrentMessages(agent);
      this.processCurrentSuggestions(agent);
      this.processCurrentOptions(agent);
      agent.sendResponses(responseType);
    }
  }

  /**
   * Customize how the set of messages are transformed on given to the agent
   *
   * @protected
   * @abstract
   * @param {IAgent} agent
   * @memberof BaseResponseBuilder
   */
  protected abstract processCurrentMessages(agent: IAgent);

  /**
   * Customize how the set of suggestions are transformed and given to the agent
   *
   * @protected
   * @abstract
   * @param {IAgent} agent
   * @memberof BaseResponseBuilder
   */
  protected abstract processCurrentSuggestions(agent: IAgent);

  /**
   * Customize how options are transformed and give to the agent
   *
   * @protected
   * @abstract
   * @param {IAgent} agent
   * @memberof BaseResponseBuilder
   */
  protected abstract processCurrentOptions(agent: IAgent);
}
