const Phantom = require('phantom');
const Cheerio = require('cheerio');
var Logger = require("./utils/logger");

var moduleName = "fetcher";

let fetcher = {
    phantomInstance: null,
    webPage: null,
    timer: null
};

fetcher.init = async function(dataCallback){
    Logger.info(`${moduleName} 初始化`);
    this.phantomInstance  = await Phantom.create();
    this.webPage = await this.phantomInstance.createPage();
    this.dataCallback = dataCallback;
};

fetcher.start = function (dataCallback, fetchInterval) {
    this.fetchInterval = fetchInterval;
    this.init(dataCallback).then(()=>{
        this.fetchDataContinuously(fetchInterval);
    });
};

fetcher.restart = function () {
    (async ()=>{
        await this.deInit();
        await this.init(this.dataCallback);

        this.fetchDataContinuously(this.fetchInterval);
    })();
};

fetcher.deInit = async function(){
    Logger.info(`${moduleName} 反初始化`);
    try{
        if(this.timer)
        {
            clearInterval(this.timer);
            this.timer = null;
        }

        await this.webPage.close();
        this.webPage = null;
        await this.phantomInstance.exit();
        this.phantomInstance = null;
    }
    catch(error){
        Logger.error(`${moduleName} deInit失败:${error}`);
    }
};

fetcher.fetchDataContinuously = function(intervalTime){
    if(!intervalTime)
    {
        Logger.warn(`${moduleName} 爬取页面的时间间隔未赋值，使用默认的60秒`);
        intervalTime = 60000;
    }

    this.fetchDataOnce();
    this.timer = setInterval(()=>{
        this.fetchDataOnce();
    }, intervalTime);
};

fetcher.fetchDataOnce = function() {
    (async ()=>{
        try{
            if(this.phantomInstance&&this.webPage)
            {
                Logger.info(`${moduleName} 开始载入页面`);
                const status = await this.webPage.open('http://odds.500.com/#!league=%5B40%2C65%2C109%2C135%2C352%5D');
                const content = await this.webPage.property('content');
                // console.log(content);
                Logger.info(`${moduleName} 开始解析页面`);
                const $ = Cheerio.load(content);

                let matchObjArr = [];
                //比赛是“世界杯”，且公司是“Bet365”的tr
                $('#main-tbody tr[data-mid="110"][data-cid="3"]').each((i, elem)=>{
                    let oneMatchObj = {
                        match_time: $(elem).find('td:nth-child(4)').text(),
                        odds_win: $(elem).find('td:nth-child(12)').text(),
                        odds_draw: $(elem).find('td:nth-child(13)').text(),
                        odds_lose: $(elem).find('td:nth-child(14)').text(),
                    };
                    let teamLinkNodes = $(elem).find('a.team_link');
                    if(teamLinkNodes.length>=2)
                    {
                        oneMatchObj.home_team = $(teamLinkNodes[0]).attr('title');
                        oneMatchObj.visiting_team = $(teamLinkNodes[1]).attr('title');
                    }

                    matchObjArr.push(oneMatchObj);
                });
                // console.log(matchObjArr);
                Logger.info(`${moduleName} 解析结果输出`);
                if(this.dataCallback)
                {
                    this.dataCallback(matchObjArr);
                }
            }
        }
        catch(error){
            Logger.error(`${moduleName} 爬取数据时出错:${error}`);

            Logger.info(`${moduleName} 尝试重启`);
            this.restart();
        }
    })();
};

module.exports = fetcher;