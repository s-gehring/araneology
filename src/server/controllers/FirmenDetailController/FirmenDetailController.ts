import { Controller } from "../../Controller";
import { IncomingMessage } from "http";
import * as PROPERTIES from "../../../shared/properties.json";

import { ServerException } from "../../ServerException";
import { loadSqlFromFile, SQL, SQLResultRow } from "../../util/SqlHelper";
import { Handelsregisterbekanntmachung } from "../../../shared/Handelsregisterbekanntmachung";
import { Insolvenzregisterbekanntmachung } from "../../../shared/Insolvenzregisterbekanntmachung";
import { getQueryParameters } from "../../util/UrlUtil";
import { FirmenDetailsControllerResponse } from "../../../shared/api/FirmenDetailController";

export class FirmenDetailController implements Controller {
  private sqlite3 = require("sqlite3").verbose();

  private SQL_COMMAND_HARE = loadSqlFromFile(
    __dirname,
    "GET_ALL_HARE_FOR_FIRMA.sql"
  );
  private SQL_COMMAND_INSO = loadSqlFromFile(
    __dirname,
    "GET_ALL_INSO_FOR_FIRMA.sql"
  );
  private SQL_COMMAND_SINGLE = loadSqlFromFile(
    __dirname,
    "GET_SINGLE_FIRMA.sql"
  );

  private issueSqlCommand(
    database: any,
    sql: SQL,
    parameter: number | string
  ): Promise<Array<SQLResultRow>> {
    return new Promise<Array<SQLResultRow>>((resolve, reject) => {
      const statement = database.prepare(sql, [], (error: any) => {
        if (error !== null) {
          console.error("Failed to prepare statement.", error);
        }
      });

      statement.all(parameter, (error: any, rows: Array<SQLResultRow>) => {
        if (error === null) {
          resolve(rows);
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

  private mapSqlResultToHaRe(
    sqlResult: SQLResultRow
  ): Handelsregisterbekanntmachung {
    return {
      datum: new Date(sqlResult.ereignisDatum),
      url: sqlResult.url,
    };
  }

  private mapSqlResultToInso(
    sqlResult: SQLResultRow
  ): Insolvenzregisterbekanntmachung {
    return {
      datum: new Date(sqlResult.datum),
      url: sqlResult.url,
    };
  }

  async handleRequest(
    incomingMessage: IncomingMessage
  ): Promise<FirmenDetailsControllerResponse> {
    const id = Number(getQueryParameters(incomingMessage).get("id"));
    const database = new this.sqlite3.Database(
      "/home/simon/sample.sqlite",
      this.sqlite3.OPEN_READONLY
    );

    const harePromise = this.issueSqlCommand(
      database,
      this.SQL_COMMAND_HARE,
      id
    );
    const insoPromise = this.issueSqlCommand(
      database,
      this.SQL_COMMAND_INSO,
      id
    );
    const firmaPromise = this.issueSqlCommand(
      database,
      this.SQL_COMMAND_SINGLE,
      id
    );

    const [sqlHares, sqlInsos, sqlFirma] = await Promise.all([
      harePromise,
      insoPromise,
      firmaPromise,
    ]);
    database.close();

    const resultHare = sqlHares.map((h: any) => this.mapSqlResultToHaRe(h));
    const resultInso = sqlInsos.map((i: any) => this.mapSqlResultToInso(i));
    const resultFirma = sqlFirma[0];

    return {
      name: resultFirma.name,
      id: resultFirma.id,
      haRes: resultHare,
      insos: resultInso,
    };
  }

  private getServerException(message: string, cause?: any): ServerException {
    return {
      httpStatus: 500,
      message,
      thrown: cause,
    };
  }

  pathMatcher: RegExp = RegExp(PROPERTIES.server.api.getSingleFirma);
}
