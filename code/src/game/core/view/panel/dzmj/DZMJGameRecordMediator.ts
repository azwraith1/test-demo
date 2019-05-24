module dzmj {
	export class DZMJGameRecordMediator extends BaseMediator {
		public static NAME: string = "DZMJGameRecordMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(DZMJGameRecordMediator.NAME, viewComponent);
		}
		public viewComponent: DZMJGameRecordPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_DZMJRECORD,
				PanelNotify.CLOSE_DZMJRECORD
			];
		}
		public onRegister() {
			super.onRegister();
		}

		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			this.viewComponent = new DZMJGameRecordPanel();
			this.showUI(this.viewComponent, false, 0, 0, 0);

		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_DZMJRECORD:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent();
					}
					break;
				case PanelNotify.CLOSE_DZMJRECORD:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}