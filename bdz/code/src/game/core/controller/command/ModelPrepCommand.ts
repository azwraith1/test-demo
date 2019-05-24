/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:25:23 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-11-22 15:57:34
 * @Description: 提前注册代理对象类
 */
module game {

  export class ModelPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
      super();
    }
    public execute(notification: puremvc.INotification): void {
      var proxys: any = [
        NetProxy,
        PlayerProxy,
        RoomProxy,
        GameProxy
      ];
      var self = this;
      _.forEach(proxys, function (proxy, index) {
        var proxyObj = new proxys[index]();
        self.facade.registerProxy(proxyObj);
        if (proxyObj && proxyObj.init) {
          proxyObj.init();
        }
      })
      // this.facade.registerProxy(new NetProxy());
      // //游戏其他需要存储数据
      // this.facade.registerProxy(new PlayerProxy());
      // this.facade.registerProxy(new AudioProxy());
    }
  }
}