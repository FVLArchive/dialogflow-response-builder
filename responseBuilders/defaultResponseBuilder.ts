import { IAgent } from '../agents/IAgent';
import { BaseResponseBuilder } from './BaseResponseBuilder';

// As an example design principal we could say that there should be no more than 5 items in a carousel.
const MAX_CAROUSEL_CARDS = 5;

/**
 * builds the response for dialogflow v2 api
 */
export class DefaultResponseBuilder extends BaseResponseBuilder {
  protected processCurrentMessages(agent: IAgent) {
    agent.pushMessages(...this.messages);
  }

  /**
   * converts the current options to either a card, carousel, or list
   * Adds the converted options into the output response
   */
  protected processCurrentOptions(agent: IAgent) {
    const length = this.options.length;
    if (length > 0) {
      if (length === 1) {
        agent.pushCards(this.options[0]);
      } else if (length <= MAX_CAROUSEL_CARDS) {
        agent.pushCarousel(...this.options);
      } else agent.pushList(...this.options);
    }
  }

  protected processCurrentSuggestions(agent: IAgent) {
    agent.pushSuggestions(...this.suggestions);
  }
}
