/*
 * @Author: he bing 
 * @Date: 2018-07-31 15:56:09 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-11-27 11:22:59
 * @Description: 
 */
class SettingMediator extends BaseMediator {
	public static NAME: string = "SettingMediator";
	public type: string = "panel";
	public constructor(viewComponent: any = null) {
		super(SettingMediator.NAME, viewComponent);
	}
	public viewComponent: SettingPanel;
	public listNotificationInterests(): Array<any> {
		return [
			PanelNotify.OPEN_SETTING,
			PanelNotify.CLOSE_SETTING
		];
	}
	public onRegister() {
		super.onRegister();
	}

	public showViewComponent(setIndex) {
		if (this.viewComponent) {
			return;
		}
		if (GameConfig.CURRENT_ISSHU) {
			RotationLoadingShu.instance.load(["set"], "", () => {
				this.viewComponent = new SettingPanel(setIndex);
				this.showUI(this.viewComponent, false, 0, 0, 0);
			});
			return;
		} else {
			RotationLoading.instance.load(["set"], "", () => {
				this.viewComponent = new SettingPanel(setIndex);
				this.showUI(this.viewComponent, false, 0, 0, 0);
			});
		}
	}

	public handleNotification(notification: puremvc.INotification): void {
		switch (notification.getName()) {
			case PanelNotify.OPEN_SETTING:
				if(!notification.getBody()){
					notification.setBody({});
				}
				let setIndex = notification.getBody().setIndex;
				this.showViewComponent(setIndex);
				break;
			case PanelNotify.CLOSE_SETTING:
				this.closeViewComponent(0);
				break;
		}
	}
}