
#### 安装Node环境(已安装则忽略)
1、把node   拷贝到/usr/local/(node)
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
3.启动程序：
pm2 start index.js --name wc_crawler 
4.关闭程序：
pm2 delete wc_crawler    
5.查看程序运行状态：
pm2 ls
6.查看日志：
[/home/qa/testing/gymj/wc_crawler/logs]tail -f info-2018-06-13.log 