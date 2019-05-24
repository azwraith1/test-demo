module bjle {
	export class BjlDLItem extends eui.Component {
		private points: any;
		public constructor() {
			super();
			this.createPoints();
		}

		private createPoints() {
			this.points = {};
			this.points[1] = { x: 0, y: 0 };
			this.points[2] = { x: 0, y: 18 };
			this.points[3] = { x: 0, y: 36 };
			this.points[4] = { x: 0, y: 54 };
			this.points[5] = { x: 0, y: 72 };
			this.points[6] = { x: 0, y: 90 };
		}

		/**
		 * 给每个点设置位置。
		 */
		public setPosition(image, index) {
			let point = this.points[index];
			image.x = point.x;
			image.y = point.y;
		}
	}
}