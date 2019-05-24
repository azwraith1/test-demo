/**
 * 弹出提示
 */
module rbwar {
	export class RbwPlayerListMediator extends BaseMediator {
		public static NAME: string = "RbwPlayerListMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(RbwPlayerListMediator.NAME, viewComponent);
		}

		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_RBWARPL,
				PanelNotify.CLOSE_RBWARPL
			];
		}

		public showViewComponent(type = 7) {
			this.viewComponent = new RbwPlayerList();
			this.showUI(this.viewComponent, false, 0, 0, 0);
		}

		public viewComponent: RbwPlayerList;
		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case PanelNotify.OPEN_RBWARPL: {
					this.showViewComponent();
					break;
				}
				case PanelNotify.CLOSE_RBWARPL:
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