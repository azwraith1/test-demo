/*
 * @Author: Li MengChan 
 * @Date: 2018-06-29 10:09:12 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:07:57
 * @Description: 手牌的基本类: 13张 固定命名规范
 */
module majiang {
	export class BaseShoupaiGroup extends game.BaseUI {
		//记录的详细的坐标点
		protected recordsJson: any = {};
		public mainGroup: eui.Group;
		public shoupais: any = [];
		public mopai;//MineShoupai;
		public index: number;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			//记录坐标点
			this.setRecords();
			this.mainGroup.removeChildren();
		}

		/**
		 * 设置坐标点
		 */
		public setRecords() {
			for (var i = 1; i <= 14; i++) {
				var image: eui.Image = this['image' + i];
				game.UIUtils.setAnchorPot(image);
				if (image) {
					this.recordsJson[i] = {};
					this.recordsJson[i].source = image.source;
					this.recordsJson[i].x = image.x;
					this.recordsJson[i].y = image.y;
					this.recordsJson[i].scaleX = image.scaleX;
					this.recordsJson[i].scaleY = image.scaleY;
					this.recordsJson[i].name = "mj" + i;
					// this.recordsJson[i - 1] = new egret.Point(image.x, image.y);
				}
			}
		}

		/**
	 * 游戏结束设置坐标点
	 */
		public setRecordsOver() {
			for (var i = 15; i <= 27; i++) {
				var image: eui.Image = this['image' + i];
				game.UIUtils.setAnchorPot(image);
				if (image) {
					this.recordsJson[i] = {};
					this.recordsJson[i].source = image.source;
					this.recordsJson[i].x = image.x;
					this.recordsJson[i].y = image.y;
					this.recordsJson[i].scaleX = image.scaleX;
					this.recordsJson[i].scaleY = image.scaleY;
					this.recordsJson[i].name = "mj" + i;
					// this.recordsJson[i - 1] = new egret.Point(image.x, image.y);
				}
			}
		}

		/**
		 * 换三张隐藏右边3张牌
		 */
		public hideRight3pais(noVisible: boolean = false) {
			if (this.mainGroup.numChildren < 1) {
				return;
			}
			var index = 14;
			if (!this.mainGroup.getChildByName("mj" + index)) {
				index = 13;
			}
			for (var i = index; i > index - 3; i--) {
				this.mainGroup.getChildByName("mj" + i).visible = noVisible;
			}
		}

		public showAllShoupai() {
			for (var i = 0; i < this.shoupais.length; i++) {
				this.shoupais[i].visible = true;
			}
		}


		public isMopais(length) {
			let arrs = [2, 5, 8, 11, 14];
			return arrs.indexOf(length) > -1;
		}

		/**
		 * 碰牌删除手牌2个
		 * @param  {} color
		 */
		public removeShoupaiByPeng(color) {
			this.removeLastPai();
			this.removeLastPai();
		}

		public removeLastPai() {
			let mj1 = this.getLastMajiang();
			game.Utils.removeArrayItem(this.shoupais, mj1);
			game.UIUtils.removeSelf(mj1);
		}


		public getLastVisibleMajiang() {
			for (var i = 14; i > 0; i--) {
				let majiang = this.mainGroup.getChildByName("mj" + i);
				if (majiang && majiang.visible) {
					return majiang;
				}
			}
			return null;
		}

		public getLastMajiang() {
			for (var i = 14; i > 0; i--) {
				let majiang = this.mainGroup.getChildByName("mj" + i);
				if (majiang) {
					return majiang;
				}
			}
			return null;
		}

		public getMopaiPosition() {
			let number = this.mainGroup.numChildren;
			return this.recordsJson[number];
		}


		/**
		 * 重新连接过后
		 */
		public changeLast2Mopai(card) {
			//如果是摸牌的角度
			if (this.isMopais(this.shoupais.length)) {
				let last = this.getLastMajiang() as MineShoupai;
				if (card) {
					this.mopai.resetValue(last.value);
				}
				game.Utils.removeArrayItem(this.shoupais, last);
				game.UIUtils.removeSelf(last);
				this.showMopai(false);
			}
		}

		public hideMopai() {
			this.mopai.visible = false;
		}

		protected showMopai(needAni: boolean) {
			this.mopai.visible = true;
			this.setPointByIndex(this.shoupais.length + 1);
		}

		public playerNewCardPush(card) {
			if (card && this.mopai['colorImage']) {
				this.mopai['showColor'](card);
			}
			this.setPointByIndex(this.shoupais.length + 1);
			this.mopai.visible = true;
			let yIndex = this.mopai.y;
			this.mopai.y -= 20;
			egret.Tween.get(this.mopai).to({
				y: yIndex
			}, 200);
		}

		public setPointByIndex(index) {
			let pos = this.recordsJson[index];
			if(pos){
				this.mopai.x = pos.x;
				this.mopai.y = pos.y;
			}
			if (this.mopai.changeBgResource) {
				this.mopai.changeBgResource(pos.source);
			}
		}

		public clearGroup() {
			this.shoupais = [];
			this.mainGroup.removeChildren();
			this.mopai = null;
		}


		public shoupaisVisible() {
			for (let i = 0; i < this.shoupais.length; i++) {
				this.shoupais[i].visible = false;

			}

		}
	}
}