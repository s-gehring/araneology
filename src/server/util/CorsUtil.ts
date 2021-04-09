import { ServerResponse } from "http";
type Header = { key: string; value: string };

const HEADERS: Header[] = [{ key: "Access-Control-Allow-Origin", value: "*" }];

export function addAllCorsHeaders(response: ServerResponse): void {
  for (const header of HEADERS) {
    response.setHeader(header.key, header.value);
  }
}
