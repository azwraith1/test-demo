import paramiko
import zipfile
import os
import os.path
import sys

def zipDir(dirpath, outFullName):
    """
    压缩指定文件夹
    :param dirpath: 目标文件夹路径
    :param outFullName: 压缩文件保存路径+xxxx.zip
    :return: 无
    """
    zip = zipfile.ZipFile(outFullName,"w",zipfile.ZIP_DEFLATED)
    for path,dirnames,filenames in os.walk(dirpath):
        # 去掉目标跟路径，只对目标文件夹下边的文件及文件夹进行压缩
        fpath = path.replace(dirpath,'')

        for filename in filenames:
            zip.write(os.path.join(path,filename),os.path.join(fpath,filename))
    zip.close()

str = input("请选择要发布的版本"
            "\n1-外网测试: "
            "\n2-AWS测试: "
            "\n3-测试服务器"
            "\n4-CQ正式服务器"
            # "\n5-CQ测试服务器"
            )

if str == "1":
    hostname = "120.78.145.185"
    hostPort = 22
    name = "root"
    password = "Bole#123"
    filePath = "D:\\gameWork\\bl_client\\code\\bin-release\\web\\1\\"
    zipName = "1.zip"
    linuxPath = "/home/"
    linuxCmd1 = "cd /home/;sh unzip.sh"
    keyLogin = False
    cmdPath = "D:\\gameWork\\bl_client\\code\\"
    print("本次操作-外网测试服务器")
elif str == "2":
    hostname = "43.254.45.47"
    hostPort = 58000
    name = "limengchan"
    password = "zR@v3x!zZSiudZVeNpG2v!aZNl1S"
    filePath = "D:\\gameWork\\bl_client\\code\\bin-release\\web\\1\\"
    zipName = "1.zip"
    linuxPath = "/home/limengchan/server/"
    linuxCmd1 = "cd /home/limengchan/server/;sh unzip.sh"
    keyLogin = False
    cmdPath = "D:\\gameWork\\bl_client\\code\\"
    print("本次操作-AWS测试服务器")
elif str == "3":
    hostname = "13.113.217.111"
    hostPort = 58000
    name = "bole"
    password = "d2uLxfmCWZX90WKj"
    filePath = "C:\\blgame\\bl_client\\code\\bin-release\\web\\1\\"
    zipName = "1.zip"
    linuxPath = "/mnt/www/"
    linuxCmd1 = "cd /mnt/www/;sh unzip.sh"
    keyLogin = True
    publicKeyPath = "C:\\tx\\alltest"
    cmdPath = "C:\\blgame\\bl_client\\code\\"
    print("本次操作-QA测试服务器")
elif str == "4":
    hostname = "52.196.212.253"
    hostPort = 58000
    name = "bole"
    password = "d2uLxfmCWZX90WKj"
    filePath = "D:\\gameWork\\bl_client\\cq9mj\\code\\bin-release\\web\\1\\"
    zipName = "1.zip"
    linuxPath = "/home/bole/server/"
    linuxCmd1 = "cd /home/bole/server/;sh unzip.sh"
    keyLogin = True
    publicKeyPath = "D:\\pubickeys\\cq9server"
    cmdPath = "D:\\gameWork\\bl_client\\\cq9mj\\code\\"
    print("本次操作-QA测试服务器")
else:
    print("操作无效")
    sys.exit();

publishStr = input("是否打包 Y/N")
if publishStr == 'y' or publishStr == 'Y':
    os.system("cd " + cmdPath + " && " + " publish.cmd")
    print("打包中")
    zipDir(filePath, filePath + zipName)
    print("游戏打包成功,开始上传。请等待")
else:
    print("不打包,开始上传。请等待")
# sureStr = input("再次确认Y/N");
# if sureStr != "y" and sureStr != "Y":
#     print("本次操作-取消")
#     sys.exit();
# sys.exit();

if keyLogin is False:
    transport = paramiko.Transport((hostname, hostPort))
    transport.connect(username=name, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)
    sftp.put(filePath + zipName, linuxPath + zipName)
    transport.close()#关闭连接
    print("游戏上传完成准备解压，请等待")

    # 创建SSH对象
    ssh = paramiko.SSHClient()
    # 允许连接不在know_hosts文件中的主机
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    # 连接服务器
    ssh.connect(hostname=hostname, port=hostPort, username=name, password=password)
    # 执行命令
    stdin, stdout, stderr = ssh.exec_command(linuxCmd1)
    # 获取命令结果
    result = stdout.read()
    print("解压完成,请刷新CDN")
    ssh.close()
else:
    key = paramiko.RSAKey.from_private_key_file(publicKeyPath, password=password)
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname=hostname, port=hostPort, username=name, password=password, pkey=key)
    t = ssh.get_transport()
    sftp = paramiko.SFTPClient.from_transport(t)
    sftp.put(filePath + zipName, linuxPath + zipName)
    print("游戏上传完成准备解压，请等待")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())  # 通过公共方式进行认证 (不需要在known_hosts 文件中存在)
    # ssh.load_system_host_keys() #如通过known_hosts 方式进行认证可以用这个,如果known_hosts 文件未定义还需要定义 known_hosts
    ssh.connect(hostname=hostname, port=hostPort, username=name, password=password, pkey=key)  # 这里要 pkey passwordkey 密钥文件
    stdin, stdout, stderr = ssh.exec_command(linuxCmd1)
    print("解压完成,请刷新CDN")
    ssh.close()