import { IncomingMessage, Server, ServerResponse } from "http";
import * as PROPERTIES from "../shared/properties.json";
import { addAllCorsHeaders } from "./util/CorsUtil";
import { Controllers } from "./Controllers";
import { handleException } from "./ServerException";

const http = require("http");

const hostname = PROPERTIES.server.hostname;
const port = PROPERTIES.server.port;

const server: Server = http.createServer(
  (request: IncomingMessage, serverResponse: ServerResponse) => {
    addAllCorsHeaders(serverResponse);

    const validControllers = Controllers.filter((c) =>
      c.pathMatcher.test(request.url!)
    );
    if (validControllers.length === 0) {
      serverResponse.statusCode = 404;
      serverResponse.end(`Found no controller for url '${request.url}'.`);
      return;
    }
    if (validControllers.length !== 1) {
      console.warn(
        `Found ${validControllers.length} valid controllers for url ${request.url}. Only executing first one.`
      );
    }
    validControllers[0]
      .handleRequest(request)
      .then((result: any) => {
        serverResponse.statusCode = 200;
        serverResponse.setHeader("Content-Type", "application/json");
        serverResponse.write(JSON.stringify(result));
      })
      .catch((error) => {
        handleException(request, serverResponse, error, validControllers[0]);
      })
      .finally(() => {
        serverResponse.end();
      });
  }
);

server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}/`);
});
