![Latest Release](https://vsmarketplacebadge.apphb.com/version/emallin.phpunit.svg) ![Installs](https://vsmarketplacebadge.apphb.com/installs-short/emallin.phpunit.svg) ![Rating](https://vsmarketplacebadge.apphb.com/rating-short/emallin.phpunit.svg)
# Phpunit for VSCode
## Setup
* Install [phpunit](https://phpunit.de/).
* Set the config values:
```JSON
{
    "phpunit.execPath": "path/to/phpunit",
    "phpunit.args": [
        "--configuration", "./phpunit.xml.dist"
    ],
    "phpunit.preferRunClassTestOverQuickPickWindow": false // Default false
}
```

## How to use
Run with (`Cmd+Shift+P` on OSX or `Ctrl+Shift+P` on Windows and Linux) and execute the `PHPUnit Test` command.
* **Test a function**: Place cursor on a function and run.

![vscode-phpunit-test-function](images/vscode-phpunit-test-function.gif)

* **Test a class**: Place cursor on class name and run.

![vscode-phpunit-test-class](images/vscode-phpunit-test-class.gif)

* **Pick test from a list**: Place cursor anywhere in class except on class name or on a function and run.

![vscode-phpunit-quick-pick](images/vscode-phpunit-quick-pick.gif)

* **Test everything according to --configuration**: Close editor window and run.

![vscode-phpunit-test-all](images/vscode-phpunit-test-all.gif)

* **Test everything in a directory**: Open a file in the directory to test and run the `PHPUnit Test Directory` command.

![vscode-phpunit-test-directory](images/vscode-phpunit-test-directory.gif)

## Notes / Tips / Advanced
* **execPath** is recommended to set in your 'user settings'. Having phpunit in PATH doesn't work (at least on windows 10) =(.
* **args** is recommended to set in your 'workspace settings'. You can add any phpunit args, check phpunit --help.
* To hook into the debugger ([github.com/felixfbecker/vscode-php-debug](https://github.com/felixfbecker/vscode-php-debug)). Add Key:`XDEBUG_CONFIG`, Value:`idekey=VSCODE` to your environment variables. (Tested on Windows 10)