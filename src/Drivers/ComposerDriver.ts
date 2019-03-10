import * as cmdExists from "command-exists";
import * as fs from "fs";
import * as os from "os";
import * as vscode from "vscode";
import { RunConfig } from "../RunConfig";
import PhpUnitDriverInterface from "./PhpUnitDriverInterface";

export default class Composer implements PhpUnitDriverInterface {
  public name: string = "Composer";
  private phpPathCache: string;
  private phpUnitPathCache: string;

  public async run(args: string[]): Promise<RunConfig> {
    let execPath = await this.phpUnitPath();

    if (os.platform() == "win32") {
      execPath = await this.phpPath();
      args = [await this.phpUnitPath()].concat(args);
    }

    const command = `${execPath} ${args.join(" ")}`;

    return {
      command: command
    };
  }

  public async isInstalled(): Promise<boolean> {
    return (await this.phpPath()) != null && (await this.phpUnitPath()) != null;
  }

  public async phpPath(): Promise<string> {
    if (this.phpPathCache) {
      return this.phpPathCache;
    }

    const config = vscode.workspace.getConfiguration("phpunit");
    try {
      this.phpPathCache = await cmdExists(config.get<string>("php"));
    } catch (e) {
      try {
        this.phpPathCache = await cmdExists("php");
      } catch (e) {}
    }

    return this.phpPathCache;
  }

  public async phpUnitPath(): Promise<string> {
    if (this.phpUnitPathCache) {
      return this.phpUnitPathCache;
    }

    const findInWorkspace = async (): Promise<string> => {
      const uris =
        os.platform() === "win32"
          ? await vscode.workspace.findFiles(
              "**/vendor/phpunit/phpunit/phpunit",
              "**/node_modules/**",
              1
            )
          : await vscode.workspace.findFiles(
              "**/vendor/bin/phpunit",
              "**/node_modules/**",
              1
            );

      return (this.phpUnitPathCache =
        uris && uris.length > 0 ? uris[0].fsPath : null);
    };

    const config = vscode.workspace.getConfiguration("phpunit");
    const phpUnitPath = config.get<string>("phpunit");
    if (phpUnitPath) {
      return new Promise<string>((resolve, reject) => {
        fs.exists(phpUnitPath, exists => {
          if (exists) {
            this.phpUnitPathCache = phpUnitPath;
            resolve(this.phpUnitPathCache);
          } else {
            reject();
          }
        });
      }).catch(findInWorkspace);
    }

    return await findInWorkspace();
  }
}
