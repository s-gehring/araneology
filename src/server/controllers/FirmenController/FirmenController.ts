import { Controller } from "../../Controller";
import { IncomingMessage } from "http";
import { SimpleFirma } from "../../../shared/Firma";
import * as PROPERTIES from "../../../shared/properties.json";

import { ServerException } from "../../ServerException";
import { loadSqlFromFile, SQLResultRow } from "../../util/SqlHelper";
import { getQueryParameters, getRequiredParameter } from "../../util/UrlUtil";
import { FirmenControllerResponse } from "../../../shared/api/FirmenController";

const SIZE_PER_PAGE = 20;

export class FirmenController implements Controller {
  private sqlite3 = require("sqlite3").verbose();

  private SQL_GET_LIMITED_FIRMEN = loadSqlFromFile(
    __dirname,
    "GET_LIMITED_FIRMEN.sql"
  );
  private SQL_COUNT_FIRMEN = loadSqlFromFile(__dirname, "COUNT_FIRMEN.sql");

  private getCount(database: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      database.get(
        this.SQL_COUNT_FIRMEN,
        [],
        (error: any, row: SQLResultRow) => {
          if (error === null) {
            resolve(row.cnt);
          } else {
            reject(
              this.getServerException(
                "The sqlite database is not readable.",
                error
              )
            );
          }
        }
      );
    });
  }

  private getFirmen(database: any, page: number): Promise<SimpleFirma[]> {
    return new Promise<SimpleFirma[]>((resolve, reject) => {
      const statement = database.prepare(
        this.SQL_GET_LIMITED_FIRMEN,
        [],
        (error: any) => {
          if (error !== null) {
            console.error("Failed to prepare statement.", error);
          }
        }
      );

      const parameters = {
        $limit: SIZE_PER_PAGE,
        $offset: SIZE_PER_PAGE * page,
      };

      statement.all(parameters, (error: any, rows: Array<SQLResultRow>) => {
        if (error === null) {
          resolve(
            rows.map((row) => ({
              id: row.id,
              name: row.name,
            }))
          );
        } else {
          reject(
            this.getServerException(
              "The sqlite database is not readable.",
              error
            )
          );
        }
      });
      statement.finalize();
    });
  }

  async handleRequest(
    request: IncomingMessage
  ): Promise<FirmenControllerResponse> {
    const database = new this.sqlite3.Database(
      "/home/simon/sample.sqlite",
      this.sqlite3.OPEN_READONLY
    );
    database.on("trace", (sql: string) => {
      console.debug("[SQL]: " + sql);
    });
    const page = Number(
      getRequiredParameter(getQueryParameters(request), "page")
    );

    const resultingFirmen = await this.getFirmen(database, page);
    const count = await this.getCount(database);
    database.close();

    return {
      firmen: resultingFirmen,
      pages: count / SIZE_PER_PAGE,
      totalcount: count,
      currentpage: page,
    };
  }

  private getServerException(message: string, cause?: any): ServerException {
    return {
      httpStatus: 500,
      message,
      thrown: cause,
    };
  }

  pathMatcher: RegExp = RegExp(PROPERTIES.server.api.getAllFirmen);
}
