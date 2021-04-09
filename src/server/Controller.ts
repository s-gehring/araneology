import { IncomingMessage } from "http";

export interface Controller {
  handleRequest: (request: IncomingMessage) => Promise<object>;

  pathMatcher: RegExp;
}
