import { IncomingMessage, ServerResponse } from "http";
import { Controller } from "./Controller";

export interface ServerException {
  message: string;
  httpStatus: number;
  thrown?: any;
}

export function handleException(
  request: IncomingMessage,
  response: ServerResponse,
  thrown: any,
  throwingController: Controller
): void {
  console.error(
    `An error occurred while handling ${throwingController}. The error is %o.`,
    thrown
  );
  if ("httpStatus" in thrown) {
    response.statusCode = thrown["httpStatus"];
  }
  response.write(JSON.stringify(thrown));
}
