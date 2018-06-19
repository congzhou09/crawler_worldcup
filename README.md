#### 安装Node环境(已安装则忽略)
1.把node   拷贝到/usr/local/(node)

2.解压：

sudo xz -d node-v8.10.0-linux-x64.tar.xz

sudo tar -xvf node-v8.10.0-linux-x64.tar   

3.进入：[/usr/local/node-v8.10.0-linux-x64/bin]

4.创建软链接：

sudo ln -s /usr/local/node-v8.10.0-linux-x64/bin/node /usr/bin/node

sudo ln -s /usr/local/node-v8.10.0-linux-x64/bin/npm /usr/bin/npm

5.查看版本：

node -v

npm -v

#### 安装PM2(用于守护Node类的程序，已安装则忽略)

1.安装：

sudo npm install pm2 -g

2.创建软链接：

sudo ln -s /usr/local/node-v8.10.0-linux-x64/bin/pm2 /usr/bin/pm2
		
#### 运行程序		

1.解压wc_crawler.tar.gz到部署文件夹，进入wc_crawler；

2.执行命令：

npm install；

3.确认配置文件配置：

编辑器查看 config/config.js 内容, 其中的SCENE、gameServer、fetchIntervalMinutes配置的值正确；
游戏服务器有多个时，使用如下格式：
gameServer: ['http://172.16.2.115:13651','http://115.159.116.223:13651'],

4.预启动程序，查看启动是否正常：

node index.js

等待程序执行并在控制台输出“传数据成功”的结果，如果没有报错则按“ctrl+c”停止命令，继续下一步，如果报错则根据错误提示做处理（常见错误：游戏服务器地址配置有误或游戏服务器未开启）

5.启动程序：

pm2 start index.js --name wc_crawler 

6.关闭程序：

pm2 delete wc_crawler

7.查看程序运行状态：

pm2 ls

8.查看日志：

[/home/qa/testing/gymj/wc_crawler/logs]tail -f info-2018-06-13.log 