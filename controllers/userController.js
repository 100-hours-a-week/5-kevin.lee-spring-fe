import { fileURLToPath } from 'url';
import path from "path";
import { dirname } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

export const getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'login.html'));
};
export const getSignupPage = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'signup.html'));
};
export const getEditProfilePage = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'edit_profile.html'));
};
export const getEditPwPage = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'pw_alter.html'));
};