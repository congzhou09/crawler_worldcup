var path = require('path');
var fs = require('fs');
var winston = require('winston');
require('winston-daily-rotate-file');
require('winston-log-and-exit');
var logPath = require('../config/config').logPath;

//文件夹不存在就创建
if ( !fs.existsSync(logPath) || !fs.statSync(logPath).isDirectory()) {
    fs.mkdirSync(logPath, 0o777);
}

function getTimeStamp(){
    let oneTime = new Date();
    return `${oneTime.toLocaleTimeString()}.${oneTime.getMilliseconds()}`;
}

var Logger = {
    core: new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true
            }),
            new (winston.transports.DailyRotateFile)({
                level: 'info',
                timestamp: getTimeStamp,
                filename: path.join(logPath, 'info'),
                datePattern: '-yyyy-MM-dd.log',
                name: 'info'
            }),
            new (winston.transports.DailyRotateFile)({
                level: 'warn',
                timestamp: getTimeStamp,
                filename: path.join(logPath, 'warn'),
                datePattern: '-yyyy-MM-dd.log',
                name: 'warn'
            }),
            new (winston.transports.DailyRotateFile)({
                level: 'error',
                timestamp: getTimeStamp,
                filename: path.join(logPath, 'error'),
                datePattern: '-yyyy-MM-dd.log',
                name: 'error'
            })
        ]
    }),
    info: function (message) {
        Logger.core.log('info', message);
    },
    warn: function (message) {
        Logger.core.log('warn', message);
    },
    error: function (message) {
        Logger.core.log('error', message);
    },
    log_and_exit: function(level, message, exitCode){
        Logger.core.log_and_exit(level, message, exitCode);
    },
    stream: {
        write: function (message, encoding) {
            Logger.info(message);
        }
    },
    log_then_send: function(sendData, res, detail){
        switch(sendData.code)
        {
            case(400):
            {
                this.warn(res.req.method + res.req.originalUrl + sendData.message + (detail?detail:''));
                break;
            }
            case(500):
            {
                this.error(res.req.method + res.req.originalUrl + sendData.message + (detail?detail:''));
                break;
            }
            default:
            {
                break;
            }
        }
        res.send(sendData);
    }
};

module.exports = Logger;