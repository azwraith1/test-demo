/*
 * @Author: he bing 
 * @Date: 2018-07-31 15:26:27 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-11-27 11:19:36
 * @Description: 
 */
class HelpMediator extends BaseMediator {
	public static NAME: string = "HelpMediator";
	public type: string = "panel";
	public constructor(viewComponent: any = null) {
		super(HelpMediator.NAME, viewComponent);
	}
	public viewComponent: HelpPanel;
	public listNotificationInterests(): Array<any> {
		return [
			PanelNotify.OPEN_HELP,
			PanelNotify.CLOSE_HELP
		];
	}

	public onRegister() {
		super.onRegister();
	}

	public showViewComponent(type = 7) {
		if (this.viewComponent) {
			return;
		}
		this.viewComponent = new HelpPanel();
		this.showUI(this.viewComponent, false, 0, 0, 0);
	}

	public handleNotification(notification: puremvc.INotification): void {
		switch (notification.getName()) {
			case PanelNotify.OPEN_HELP:
				this.showViewComponent();
				break;
			case PanelNotify.CLOSE_HELP:
				this.closeViewComponent(1);
				break;

		}
	}
}