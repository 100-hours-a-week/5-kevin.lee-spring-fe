import { fileURLToPath } from 'url';
import path from "path";
import { dirname } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

export const getPostsPage = (req, res) => {
    
    res.sendFile(path.join(__dirname,'..', 'public', 'posts.html'));
};
export const getPostCreatePage = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'post_create.html'));
};
export const getPostDetailPage = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'post_detail.html'));
};
export const getPostEditPage = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'post_correct.html'));
};