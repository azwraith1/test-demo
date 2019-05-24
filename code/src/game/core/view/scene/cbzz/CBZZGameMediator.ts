/*
 * @Author: wangtao 
 * @Date: 2019-05-08 11:26:12 
 * @Last Modified by: wangtao
 * @Last Modified time: 2019-05-08 11:31:10
 * @Description: 
 */

module cbzz{
    export class CBZZGameMediator extends BaseMediator{
        public static NAME: string = "CBZZGameMediator";
		public type: string = "scene";
		public constructor() {
			super(CBZZGameMediator.NAME);
		}

		public viewComponent: CBZZMainScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_CBZZ,
				SceneNotify.CLOSE_CBZZ
			];
		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new game.LaohujiHallMediator());
			// this.facade.registerMediator(new SDXLTipsPanelMediator());
			this.facade.registerMediator(new SettingMediator());
			this.facade.registerMediator(new game.CloseLaohuMediator());
			this.facade.registerMediator(new cbzz.CBZZautoGamelMediator());
			this.facade.registerMediator(new MainHallMediator());
			this.facade.registerMediator(new dntg.DNTGGameRecordMediator());
			this.facade.registerMediator(new cbzz.CBZZTipsPanelMediator());
			
		}

		public showViewComponent() {
			this.viewComponent = new CBZZMainScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_CBZZ:
					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_CBZZ:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}