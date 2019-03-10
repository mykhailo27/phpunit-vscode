import * as cmdExists from "command-exists";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { RunConfig } from "../RunConfig";
import PhpUnitDriverInterface from "./PhpUnitDriverInterface";

export default class Path implements PhpUnitDriverInterface {
  public name: string = "Path";
  private phpPathCache: string;
  private phpUnitPathCache: string;

  public async run(args: string[]): Promise<RunConfig> {
    const execPath = await this.phpPath();
    args = [await this.phpUnitPath()].concat(args);

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

    const config = vscode.workspace.getConfiguration("phpunit");
    const phpUnitPath = config.get<string>("phpunit");
    return !phpUnitPath
      ? null
      : new Promise<string>((resolve, reject) => {
          try {
            fs.exists(phpUnitPath, exists => {
              if (exists) {
                this.phpUnitPathCache = phpUnitPath;
                resolve(this.phpUnitPathCache);
              } else {
                const absPhpUnitPath = path.join(
                  vscode.workspace.rootPath,
                  phpUnitPath
                );
                fs.exists(absPhpUnitPath, absExists => {
                  if (absExists) {
                    this.phpUnitPathCache = absPhpUnitPath;
                    resolve(this.phpUnitPathCache);
                  } else {
                    resolve();
                  }
                });
              }
            });
          } catch (e) {
            resolve();
          }
        });
  }
}
