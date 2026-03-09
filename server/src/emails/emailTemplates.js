"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEmailTemplate = exports.passwordResetEmailTemplate = exports.verificationEmailTemplate = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
exports.verificationEmailTemplate = (0, fs_1.readFileSync)(path_1.default.join(__dirname, '../emails/verificationEmailTemplate.html'), 'utf-8');
exports.passwordResetEmailTemplate = (0, fs_1.readFileSync)(path_1.default.join(__dirname, '../emails/passwordResetEmailTemplate.html'), 'utf-8');
const renderEmailTemplate = (template, values) => {
    // Replaces any template values e.g. {{VERIFY_URL}} with a concrete value provided
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => values[key] || '');
};
exports.renderEmailTemplate = renderEmailTemplate;
