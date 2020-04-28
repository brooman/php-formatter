// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs'
import * as cp from 'child_process';
import { promisify } from 'util'

export function activate(context: vscode.ExtensionContext) {
    vscode.languages.registerDocumentFormattingEditProvider('php', {
      provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const config = vscode.workspace.getConfiguration('php-formatter');
        const folder = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;

        const pluginSettings = {
          config: config.get<String>('configPath')?.replace('${workspaceFolder}', folder ?? ''),
          executable: config.get<String>('executablePath')?.replace('${workspaceFolder}', folder ?? '')
        }

        if (pluginSettings.executable) {
          const cfg = pluginSettings.config ? `--config=${pluginSettings.config}` : ''
          const cmd = `php ${pluginSettings.executable} fix ${cfg} ${document.fileName}`

          cp.exec(cmd, err => {
            if (err) {
              throw err
            }

            document.save().then(err => {
              if (err) {
                throw err
              }
            })
          })
        }

        return [];
      }
  })
}

// this method is called when your extension is deactivated
export function deactivate() {}
