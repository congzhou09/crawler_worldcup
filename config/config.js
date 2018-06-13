var path = require('path');

var SCENE = 'dev';//dev-开发；sit-测试服；prod-正式服

var configObj;
switch (SCENE)
{
    case('dev'):
    {
        configObj = {
            gameServer: 'http://172.16.2.115:13651',//赔率数据上传到的游戏服务器地址
            fetchIntervalMinutes: 1,//数据采集间隔，单位是分钟
            logPath: path.join(__dirname, '../logs')//日志文件存储目录
        };
        break;
    }
    case('sit'):
    {
        configObj = {
            gameServer: 'http://115.159.116.223:13651',
            fetchIntervalMinutes: 30,
            logPath: path.join(__dirname, '../logs')
        };
        break;
    }
    case('prod'):
    {
        configObj = {
            gameServer: 'http://172.16.2.115:13651',
            fetchIntervalMinutes: 30,
            logPath: path.join(__dirname, '../logs')
        };
        break;
    }
    default:
        break;
}

module.exports = configObj;