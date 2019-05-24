module game {
	export class UpdateTickerManager {
		private allUpdateObjArr: IUpdate[] = [];

		private static _instance: UpdateTickerManager;
		private static _onesec: UpdateTickerManager;

		public static get instance(): UpdateTickerManager {
			if (!UpdateTickerManager._instance) {
				UpdateTickerManager._instance = new UpdateTickerManager();
			}
			return UpdateTickerManager._instance;
		}

		public static get onesec(): UpdateTickerManager {
			if (!UpdateTickerManager._onesec) {
				UpdateTickerManager._onesec = new UpdateTickerManager();
			}
			return UpdateTickerManager._onesec;
		}

		public add(target: IUpdate) {
			if (!Utils.isElinArr(target, this.allUpdateObjArr)) {
				this.allUpdateObjArr.push(target);
			}
		}

		public remove(target: IUpdate) {
			var len = this.allUpdateObjArr.length;
			for (var i = 0; i < len; i++) {
				if (target == this.allUpdateObjArr[i]) {
					this.allUpdateObjArr.splice(i, 1);
				}
			}
		}

		public update(dt: number) {
			for (var i = 0; i < this.allUpdateObjArr.length; i++) {
				this.allUpdateObjArr[i].update(dt);
			}
		}
	}
}