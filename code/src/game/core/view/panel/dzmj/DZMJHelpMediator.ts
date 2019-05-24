module dzmj {
	export class DZMJHelpMediator extends BaseMediator {
		public static NAME: string = "DZMJHelpMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(DZMJHelpMediator.NAME, viewComponent);
		}
		public viewComponent: DZMJHelpPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_DZMJ_HELP,
				PanelNotify.CLOSE_DZMJ_HELP
			];
		}
		public onRegister() {
			super.onRegister();
		}

		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			this.viewComponent = new DZMJHelpPanel();
			this.showUI(this.viewComponent, false, 0, 0, 0);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_DZMJ_HELP:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent();
						//this.showViewComponent(notification.getBody());
					}
					break;
				case PanelNotify.CLOSE_DZMJ_HELP:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}