/**
 * 弹出提示
 */
module rbwar {
	export class RBWarZSMediator extends BaseMediator {
		public static NAME: string = "RBWarZSMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(RBWarZSMediator.NAME, viewComponent);
		}

		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_RBWARZS,
				PanelNotify.CLOSE_RBWARZS
			];
		}

		public showViewComponent(type = 7) {
			this.viewComponent = new RBWarZSPanel();
			this.showUI(this.viewComponent, false, 0, 0, 0);
		}

		public viewComponent: RBWarZSPanel;
		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case PanelNotify.OPEN_RBWARZS: {
					this.showViewComponent();
					break;
				}
				case PanelNotify.CLOSE_RBWARZS:
					this.closeViewComponent(0);
					break;
			}
		}

        /**
         * 初始化面板ui
         */
		public initUI(): void {

		}

        /**
         * 初始化面板数据
         */
		public initData(): void {

		}

	}
}