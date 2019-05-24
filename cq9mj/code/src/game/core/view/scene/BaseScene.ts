module game {
	export class BaseScene extends BaseComponent {
		public pmdKey: string = "base";
		public constructor() {
			super();
		}

		public onAdded() {
			super.onAdded();
			PMDComponent.currentRunningScene = this.pmdKey;
		}

		public onRemoved() {
			super.onRemoved();

		}

		public paomadeng(e: egret.Event) {
			let data = e.data;
			LogUtils.logDJ(data);
		}
	}
}