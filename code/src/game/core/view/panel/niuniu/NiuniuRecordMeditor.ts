module niuniu {
	export class NiuniuRecordMeditor extends BaseMediator {
		public static NAME: string = "NiuniuRecordMeditor";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(NiuniuRecordMeditor.NAME, viewComponent);
		}
		public viewComponent: NiuniuRecordPanl;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_NIUGAMERECORD,
				PanelNotify.CLOSE_NIUGAMERECORD
			];
		}
		public onRegister() {
			super.onRegister();
		}

		public showViewComponent(num) {
			if (this.viewComponent) {
				return;
			}
			RotationLoadingShu.instance.load(["record"], "", () => {
				this.viewComponent = new NiuniuRecordPanl(num);
				this.showUI(this.viewComponent, false, 0, 0, 0);
			});
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_NIUGAMERECORD:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent(notification.getBody());
					}
					break;
				case PanelNotify.CLOSE_NIUGAMERECORD:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}