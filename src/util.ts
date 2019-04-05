'use strict';

import os = require('os');
let toolsGopath: string;

export function getBinPath(tool: string): string {
    return "";
}

export function getToolsGopath(): string {
    const envVars = Object.assign({}, process.env);
    if (envVars['GOPATH'] === "") {
        return '';
    }
    return envVars['GOPATH'] + '/bin';
}