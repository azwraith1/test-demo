module rbwar {
	export class RBWHelpPanlMediator extends BaseMediator {
		public static NAME: string = "RBWHelpPanlMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(RBWHelpPanlMediator.NAME, viewComponent);
		}

		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_RBWARHELP,
				PanelNotify.CLOSE_RBWARHELP
			];
		}

		public showViewComponent(type = 7) {
			this.viewComponent = new RBWHelpPanl();
			this.showUI(this.viewComponent, false, 0, 0, 0);
		}

		public viewComponent: RBWHelpPanl;
		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case PanelNotify.OPEN_RBWARHELP: {
					this.showViewComponent();
					break;
				}
				case PanelNotify.CLOSE_RBWARHELP:
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