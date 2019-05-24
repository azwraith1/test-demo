/**
 * 大眼路，小眼路，甲由路
 */
module bjle {
	export class BjlDXJYItem extends eui.Component {
		private points: any;
		public constructor() {
			super();
			this.createPoints();
		}

		private createPoints() {
			this.points = {};
			this.points[1] = { x: 0.5, y: 1 };
			this.points[2] = { x: 0.5, y: 9.5 };
			this.points[3] = { x: 0.5, y: 19 };
			this.points[4] = { x: 0.5, y: 27.5 };
			this.points[5] = { x: 0.5, y: 37 };
			this.points[6] = { x: 0.5, y: 45.5 };
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