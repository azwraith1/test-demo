/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:25:23 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-22 15:00:57
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
        GameProxy,
        RoomProxy
      ];
      var self = this;
      _.forEach(proxys, function (proxy, index) {
        var proxyObj = new proxys[index]();
        self.facade.registerProxy(proxyObj);
        if (proxyObj && proxyObj.init) {
          proxyObj.init();
        }
      })
    }
  }
}