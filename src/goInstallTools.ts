'use strict';

// import { DebugConsole } from 'vscode';
import * as vscode from 'vscode';
import cp = require("child_process");
import path = require('path');
import { getBinPath, getToolsGopath } from './util';

export function installTools() {
    const goRuntimePath = getBinPath('go');

    const httpProxy = vscode.workspace.getConfiguration('http').get('proxy');
    let envForTools = Object.assign({}, process.env);
    if (httpProxy) {
        envForTools = Object.assign({}, process.env, {
            http_proxy: httpProxy,
            HTTP_PROXY: httpProxy,
            https_proxy: httpProxy,
            HTTPS_PROXY: httpProxy,
        });
    }

    let toolsGopath = getToolsGopath();
    if (toolsGopath) {
        // User has explicitly chosen to use toolsGopath, so ignore GOBIN
        envForTools['GOBIN'] = '';
    }

    if (toolsGopath) {
        const paths = toolsGopath.split(path.delimiter);
        toolsGopath = paths[0];
        envForTools['GOPATH'] = toolsGopath;
    } else {
        vscode.window.showInformationMessage('Cannot install Go tools. Set either go.gopath or go.toolsGopath in settings.', 'Open User Settings', 'Open Workspace Settings').then(selected => {
            if (selected === 'Open User Settings') {
                vscode.commands.executeCommand('workbench.action.openGlobalSettings');
            } else if (selected === 'Open Workspace Settings') {
                vscode.commands.executeCommand('workbench.action.openWorkspaceSettings');
            }
        });
        return;
    }

    envForTools['GO111MODULE'] = 'off';

    // let args = [];
    let env = {};
    cp.execFile(goRuntimePath, [], env, (err, stdout, stderr) => {
        if (!err) {
            const successMessage = 'Installing all linters used by gometalinter SUCCEEDED.';
            vscode.window.showInformationMessage(successMessage);
        } else {
            const failureReason = `Error while running gometalinter --install;; ${stderr}`;
            vscode.window.showErrorMessage(failureReason);
        }
    });
}