import pino from 'pino';
import pretty from 'pino-pretty';

/*
import fs from 'fs';
import path from 'path';
const logPath = path.join(process.env.LOG_PATH, `logs_${Date.now()}.log`);
*/

const stream = pretty({
  colorize: true
});

export default pino({
  level: process.env.LOG_LEVEL || 'info'
}, stream);