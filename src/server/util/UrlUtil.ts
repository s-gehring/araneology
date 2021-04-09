import { IncomingMessage } from "http";
import * as PROPERTIES from "../../shared/properties.json";

export function getQueryParameters(request: IncomingMessage): URLSearchParams {
  const parsedUrl: URL = new URL(
    request.url!,
    `${PROPERTIES.server.protocol}://${PROPERTIES.server.hostname}:${PROPERTIES.server.port}`
  );
  return parsedUrl.searchParams;
}

export function getRequiredParameter(
  params: URLSearchParams,
  key: string
): string {
  const result = params.get(key);
  if (result === null) {
    throw {
      httpStatus: 400,
      message: `Required query parameter '${key}' is missing.`,
    };
  }
  return result;
}
