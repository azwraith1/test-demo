/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:25:44 
 * @Last Modified by:   Li MengChan 
 * @Last Modified time: 2018-06-25 14:25:44 
 * @Description: 提前注册部分Mediator
 */
module game {

  export class ViewPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

    public constructor() {
      super();
    }
    public execute(notification: puremvc.INotification): void {
      this.facade.registerMediator(new LogoMediator());
      this.facade.registerMediator(new AlertMediator());
    }
  }
}