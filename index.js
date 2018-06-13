var Request = require('request');
var Fetcher = require('./fetcher');
var Logger = require("./utils/logger");
var Config = require('./config/config');

Fetcher.start((dataFetched)=>{
    try{
        Logger.info(`新获取到数据：${JSON.stringify(dataFetched)}`);
        if(dataFetched.length)
        {
            //字段名称转换
            let dataToSend = dataFetched.map((oneElem)=>{
                return {
                    date: new Date(`2018-${oneElem.match_time}:00`).getTime(),
                    homeTeam: oneElem.home_team,
                    visitingTeam: oneElem.visiting_team,
                    homeOdds: oneElem.odds_win,
                    visitingOdds: oneElem.odds_lose,
                    dogFall: oneElem.odds_draw
                };
            });

            sendDateToServer(dataToSend);
        }
        else
        {
            Logger.warn(`获取到的数据为空`);
        }
    }
    catch(error){
        Logger.error(`获取到的数据处理时出错：${error}`);
    }
}, Config.fetchIntervalMinutes*60*1000);


//示例：[{"date":1528789866356,"visitingOdds":20,"homeOdds":10,"dogFall":30,"homeTeam":"主队0","visitingTeam":"客队0"},{"date":1528789866357,"visitingOdds":21,"homeOdds":11,"dogFall":31,"homeTeam":"主队1","visitingTeam":"客队1"},{"date":1528789866358,"visitingOdds":22,"homeOdds":12,"dogFall":32,"homeTeam":"主队2","visitingTeam":"客队2"}]
function sendDateToServer(dataFetched){
    if(dataFetched.length)
    {
        Request.post({
                url: `${Config.gameServer}/gmtools?{"area":10002,"handler":"ModifyLotteryOdds","postField":"data","server_id":16842753}`,
                form: {data: JSON.stringify(dataFetched)}
            },
            function (err, res, body) {
                if (!err) {
                    let resData = JSON.parse(res.body);
                    if(resData.result===1)//成功
                    {
                        Logger.info('向游戏服传数据成功');
                    }
                    else
                    {
                        Logger.error(`游戏服传数据失败：${resData.data}`);
                    }
                }
                else {
                    Logger.error(`游戏服传数据失败：${err}`);
                }
            }
        );
    }
}