import { mkdir, readdir } from "node:fs/promises";

import { Logger } from "lib/logger";

const FileLogger = new Logger("FileService");

export class FileController {
  private hash: string;

  constructor(hash: string) {
    this.hash = hash;
    this.createFolder();
  }

  private async createFolder() {
    if ((await this.readHashFolder()).length > 0) {
      return FileLogger.log("folder already exists, skipping");
    }
    return await mkdir(`./dist/${this.hash}/`, {
      recursive: true,
    }).then(() => FileLogger.log(`created folder: ${this.hash}`));
  }

  public async readHashFolder() {
    return await readdir(`./dist/${this.hash}/`, {
      recursive: true,
    }).catch(() => []);
  }

  public async fileExists(image: string) {
    const localFile = Bun.file(`./dist/${this.hash}/${image}`);

    return await localFile.exists();
  }

  public async writeFile(fileName: string, file: Response) {
    const exists = await this.fileExists(fileName);

    if (!exists) {
      await Bun.write(`./dist/${this.hash}/${fileName}`, file);
    }
  }

  // public async clearFolder() {
  //   const path = `./dist/${this.hash}/`;

  //   return await Bun.file(path).delete();
  // }
}
