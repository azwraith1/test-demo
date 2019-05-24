module rbwar {
	export class RBWarZSItem extends eui.Component {
		public points: any;
		private typeImage: eui.Image;
		private images: any = {};
		public constructor() {
			super();
			this.createPoints();
		}

		public getKongWei() {
			return 7 - this.numChildren;
		}

		public change2Points(images){
			this.clearData();
			this.images = images;
			for(let key in images){
				let image = ObjectPool.produce("zsitem", null);
				if (!image) {
					image = new eui.Image()
				}
				image.source = images[key].source;
				// this.setPosition
				this.addChild(images[key]);
			}
		}

		private createPoints() {
			this.points = {};
			this.points[-1] = { x: 8, y: -36 };
			this.points[1] = { x: 8, y: 8 };
			this.points[2] = { x: 8, y: 56 };
			this.points[3] = { x: 8, y: 104 };
			this.points[4] = { x: 8, y: 152 };
			this.points[5] = { x: 8, y: 201 };
			this.points[6] = { x: 8, y: 248 };
			this.clearData();
		}

		public clearData() {
			if(this.typeImage){
				this.typeImage.source = "";
			}
			for (let key in this.images) {
				let image = this.images[key];
				if (key) {
					game.UIUtils.removeSelf(image);
					ObjectPool.reclaim("zsitem", image);
				}
			}
			this.images = {};
		}

		public createChildren() {
			super.createChildren();
		}

		public showType(type) {
			this.typeImage.source = RES.getRes(`rbw_qs_p_${type}_png`);
		}

		private setPosition(image, index){
			let point = this.points[index];
			image.x = point.x;
			image.y = point.y;
			this.images[index] = image;
		}

		/**
		 * 正序
		 */
		public showArrAsc(arrData) {
			let winType = arrData[0];
			this.typeImage.source = RES.getRes(`rbw_qs_p_${winType}_png`);
		}

		public showImageByPoint(index, type) {
			let image = ObjectPool.produce("zsitem", null);
			if (!image) {
			 	image = new eui.Image()
			}
			image.source = RES.getRes(`rbw_qs_${type}_quan_png`);
			this.setPosition(image, index);
			this.addChild(image);
		}


		public findLastRow(){
			for(let index = 6; index > 0; index --){
				if(!this.checkPointsHas(index)){
					return index;
				}
			}
		}

		public showImageByDesc(type){
			let findIndex;
			for(let index = 6; index > 0; index --){
				if(!this.checkPointsHas(index)){
					findIndex = index;
					break;
				}
			}
			this.showImageByPoint(findIndex,type);
		}

		public checkPointsHas(index) {
			return !!this.images[index];
		}

		
	}
}