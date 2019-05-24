module bjle {
	export class BjlZPLItem extends eui.Component {
		private points: any;
		public constructor() {
			super();
			this.createPoints();
		}

		private createPoints() {
			this.points = {};
			this.points[1] = { x: 1, y: 1 };
			this.points[2] = { x: 1, y: 37 };
			this.points[3] = { x: 1, y: 73 };
			this.points[4] = { x: 1, y: 109 };
			this.points[5] = { x: 1, y: 145 };
			this.points[6] = { x: 1, y: 181 };
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