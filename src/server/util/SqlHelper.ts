import fileHandler from "fs";
import path from "path";

export type SQL = string;
export type SQLResultRow = { [key in string]: any };

export function loadSqlFromFile(
  currentDirname: string,
  sqlFilename: string
): SQL {
  return fileHandler.readFileSync(
    path.resolve(currentDirname, sqlFilename),
    "utf8"
  );
}
