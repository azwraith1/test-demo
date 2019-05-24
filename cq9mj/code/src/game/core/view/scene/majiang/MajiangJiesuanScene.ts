/*
 * @Author: He Bing 
 * @Date: 2018-07-06 16:29:49 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2019-02-26 18:23:45
 @Description: 麻将结算界面
 */

module majiang {
	export class MajiangJiesuanScene extends game.BaseComponent {
		//换桌
		private btn_tuichu: eui.Button;
		//下一局
		private btn_nextgame: eui.Button;
		private player_1: eui.Image;
		private player_2: eui.Image;
		private player_3: eui.Image;
		private player_4: eui.Image;
		private player_1_score: eui.BitmapLabel;
		private player_2_score: eui.Label;
		private player_3_score: eui.Label;
		private player_4_score: eui.Label;
		private everyoneGroup: eui.Group;
		private player_1_name: eui.Label;
		private player_2_name: eui.Label;
		private player_3_name: eui.Label;
		private player_4_name: eui.Label;
		private name_bg_1: eui.Image;
		private name_bg_2: eui.Image;
		private name_bg_3: eui.Image;
		private name_bg_4: eui.Image;
		private img_bg_1: eui.Image;
		private img_bg_2: eui.Image;
		private img_bg_3: eui.Image;
		private img_bg_4: eui.Image;
		private values;
		private directions;
		private btnGroup: eui.Group;
		private tips_text: eui.Label;
		private sceneGroup: eui.Group;
		public resizeGroup: eui.Group;//全屏适配
		//输赢话语。
		private win_lose_title: eui.Image;
		//输赢背景光
		private win_lose_bgs: eui.Image;
		private win_lose_bg: eui.Image;
		private othergroup: eui.Group;
		private mygroup: eui.Group;
		private scrollers: eui.Scroller;
		private errorImage: eui.Image;
		private status;
		public constructor(data) {
			super();
			this.values = data.players;
			this.status = data.status;
			this.skinName = new MajiangJiesuanSceneSkin();
			this.btnGroup.alpha = 0;
			this.win_lose_bg.alpha = 0;
			this.win_lose_bgs.alpha = 0;
			this.win_lose_title.alpha = 0;
			this.mygroup.alpha = 0;
			this.scrollers.alpha = 0;
			this.othergroup.alpha = 0;
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.EVENT_RESIZE, this.resetPosition, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.addEvent(EventNotify.EVENT_RESIZE, this.resetPosition, this);
		}

		public resetPosition(e?: egret.Event) {
			var data = e.data;
		}


		public createChildren() {
			super.createChildren();

			this.show();
			egret.Tween.get(this.win_lose_bg).to({ alpha: 0 }).to({ alpha: 1 }, 500).call(() => {
				egret.Tween.get(this.win_lose_bgs).to({ alpha: 0 }).to({ alpha: 1 }, 500);
				egret.Tween.get(this.mygroup).to({ alpha: 0 }).to({ alpha: 1 }, 500);
				egret.Tween.get(this.scrollers).to({ alpha: 0 }).to({ alpha: 1 }, 500);
				egret.Tween.get(this.othergroup).to({ alpha: 0 }).to({ alpha: 1 }, 500).call(() => {
					egret.Tween.get(this.win_lose_title).to({ alpha: 0 }).to({ alpha: 1 }, 500);
					egret.Tween.get(this.btnGroup).to({ alpha: 0 }).to({ alpha: 1 }, 500);
				});
			}).call(() => {
				if (this.status == 2) {
					this.errorImage.visible = true;
				}
			});
		}


		private show() {
			let shuJiArr = this.values;//主方法
			if (shuJiArr != null) {
				for (var key in shuJiArr) {
					let data = shuJiArr[key]
					if (Global.gameProxy.checkIndexIsMe(key)) {
						this.showMine(data, key);//是自己，要调用的方法。
					} else {
						this.showOthers(data, key);//非自己调用的方法。
					}
				}
			}
		}

		/**
		 * 显示自己
		 */
		public showMine(data, key) {
			if (data.bills.length == 0) {
				this.tips_text.visible = true;
			} else {
				for (let i = 0; i < data.bills.length; i++) {//bills是data里面的值
					if (data.bills[i]["type"] != 0) {//去掉房费。
						var item = new MajiangJiesuanRenderer(data.bills[i]);//这里是将每产生的一条信息加到这个组里面。
						this.everyoneGroup.addChild(item);
					}
				}
			}
			let header = Global.gameProxy.getPlayerByIndex(key).figure_url || Global.gameProxy.getPlayerByIndex(key)["figureUrl"]
			let headerSex = Global.gameProxy.getPlayerByIndex(key).sex || Global.gameProxy.getPlayerByIndex(key)["sex"];
			this.player_1.source = `hall_header_${headerSex}_${header}_png`;
			// data["gainGold"] = NumberFormat.fNumber(data["gainGold"]);
			// data["ownGold"] = NumberFormat.fNumber(data["ownGold"]);
			let nums = data["gainGold"];
			this.winOrLoseImg(nums);
			Global.playerProxy.playerData.gold = data["ownGold"];
			this.player_1_name.text = Global.playerProxy.playerData.nickname;//Global.playerProxy.playerData全局变量，相当于cookie。
			if (data["gainGold"] > 0) {
				this.meWinOrLoseTextColor(data["gainGold"]);
				this.player_1_score.text = "+" + NumberFormat.fNumber(data["gainGold"]);
			} else {
				this.meWinOrLoseTextColor(data["gainGold"]);
				this.player_1_score.text = "" + NumberFormat.fNumber(data["gainGold"]);
			}

		}
		/**
		 * 其他玩家
		 * 
		 */
		public showOthers(data, key) {
			this.directions = MajiangUtils.getDirectionByMine(Global.gameProxy.getMineIndex());
			var players = Global.gameProxy.getPlayers();
			let header = Global.gameProxy.getPlayerByIndex(key).figure_url || Global.gameProxy.getPlayerByIndex(key)["figureUrl"];
			let headerSex = Global.gameProxy.getPlayerByIndex(key).sex || Global.gameProxy.getPlayerByIndex(key)["sex"];
			data["gainGold"] = NumberFormat.fNumber(data["gainGold"]);
			switch (this.directions[key]) {
				case "left":
					this.img_bg_2.visible = true;
					this.name_bg_2.visible = true;
					this.player_2_name.text = players[key].nickname;
					this.player_2.source = `hall_header_${headerSex}_${header}_png`;
					this.player_2_score.text = data["gainGold"];
					this.player_2_score.textColor = this.socreW2L(data["gainGold"]);
					break;
				case "right":
					this.img_bg_4.visible = true;
					this.name_bg_4.visible = true;
					this.player_4_name.text = players[key].nickname;
					this.player_4.source = `hall_header_${headerSex}_${header}_png`;
					this.player_4_score.text =  data["gainGold"];
					this.player_4_score.textColor = this.socreW2L(data["gainGold"]);
					break;
				case "top":
					this.img_bg_3.visible = true;
					this.name_bg_3.visible = true;
					this.player_3_name.text = players[key].nickname;
					this.player_3.source = `hall_header_${headerSex}_${header}_png`;
					this.player_3_score.text =  data["gainGold"];
					this.player_3_score.textColor = this.socreW2L(data["gainGold"]);
					break;
			}
		}
		/**
		 * 判断输赢图片
		 */
		private winOrLoseImg(score: number) {
			if (score > 0) {

				this.win_lose_bgs.source = RES.getRes("js_win_bg_png");
				this.win_lose_title.source = RES.getRes("js_win_png");

				//	this.moiveC();
			} else if (score == 0) {
				this.win_lose_bgs.source = RES.getRes("js_ping_bg_png");
				this.win_lose_title.source = RES.getRes("js_ping_png");

				//	this.moiveC();
			} else {
				this.win_lose_bgs.source = RES.getRes("js_lose_bg_png");
				this.win_lose_title.source = RES.getRes("js_lose_png");
				this.win_lose_bgs.top = 20;




			}
		}

		/**
		 * 动画
		 */
		private moiveC() {
			// egret.Tween.get(this.bg_xuanzhuanguang, { loop: true }).to({ rotation: 360 }, 5000);
			// this.bg_xuanzhuanguang.mask = this.bg_xuanzhuanguang_rects;
		}
		/**
		 * 判断输赢字体颜色。
		 */
		public meWinOrLoseTextColor(fnt_color) {
			if (fnt_color > 0) {
				this.player_1_score.font = RES.getRes("win_text_fnt");
			} else {
				this.player_1_score.font = RES.getRes("lose_text_fnt");
			}
			//	this.player_1_score.textAlign = "center";
		}
		/**
		 * 判断分数正负颜色
		 */
		public socreW2L(color) {
			if (color > 0) {
				return 0xfff729;
			} else {
				return 0xffffff;
			}
		}

		/**
   * 点击方法
   */
		public async onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.btn_nextgame://下一局
					Global.gameProxy.clearRoomInfo();
					let zhunru = Global.gameProxy.lastGameConfig.diZhu;
					if (Global.playerProxy.playerData.gold <= 0 || Global.playerProxy.playerData.gold < zhunru) {
						Global.alertMediator.addAlert("金币不足");
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_JIESUAN);
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
					} else {
						var handler = ServerPostPath.hall_sceneHandler_c_enter;
						delete Global.gameProxy.lastGameConfig['roomId'];
						let data = _.clone(Global.gameProxy.lastGameConfig);
						data['isContinue'] = true;
						let resp: any = await game.PomeloManager.instance.request(handler, data);
						if (!resp) {
							return;
						}
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG_MATCH, Global.gameProxy.lastGameConfig);
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_JIESUAN);
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
						// if (resp.error && resp.error.codecv != 0) {
						//  game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
						//  return;
						// }
						// Global.gameProxy.setRoomInfo(resp);//这里是将数据主动传给服务器，并得到返回值resp.
						// game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG_MATCH);
					}
					break;
				case this.btn_tuichu://退出
					Global.gameProxy.clearRoomInfo();
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_JIESUAN);
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
					break;
			}
		}

	}
}