import * as cmdExists from "command-exists";
import * as escapeRegexp from "escape-string-regexp";
import * as vscode from "vscode";
import { IRunConfig } from "../RunConfig";
import IPhpUnitDriver from "./IPhpUnitDriver";
import { resolvePhpUnitPath } from "./PhpUnitResolver";

export default class Docker implements IPhpUnitDriver {
  public name: string = "Docker";
  private phpUnitPathCache: string;

  public async run(args: string[]): Promise<IRunConfig> {
    const config = vscode.workspace.getConfiguration("phpunit");
    const dockerImage = config.get<string>("docker.image") || "php";

    args = [
      "run",
      "--rm",
      "-t",
      "-v",
      "${pwd}:/app",
      "-w",
      "/app",
      dockerImage,
      "php",
      await this.phpUnitPath()
    ]
      .concat(args)
      .join(" ")
      .replace(
        new RegExp(escapeRegexp(vscode.workspace.rootPath), "ig"),
        "/app"
      )
      .replace(/\\/gi, "/")
      .split(" ");

    const command = `docker ${args.join(" ")}`;

    return {
      command: command,
      problemMatcher: "$phpunit-app"
    };
  }

  public async isInstalled(): Promise<boolean> {
    try {
      const dockerExists = await cmdExists("docker");
      return !!(dockerExists && (await this.phpUnitPath()));
    } catch (e) {
      return false;
    }
  }

  public async phpUnitPath(): Promise<string> {
    return (
      this.phpUnitPathCache ||
      (this.phpUnitPathCache = await resolvePhpUnitPath())
    );
  }
}
