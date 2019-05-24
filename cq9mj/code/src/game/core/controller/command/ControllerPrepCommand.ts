/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:25:10 
 * @Last Modified by:   Li MengChan 
 * @Last Modified time: 2018-06-25 14:25:10 
 * @Description: 提前注册Command
 */
module game {

    export class ControllerPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }
        public execute(notification: puremvc.INotification): void {

        }
    }
}