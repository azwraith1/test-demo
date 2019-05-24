/*
 * @Author: He Bing 
 * @Date: 2018-07-03 14:11:47 
 * @Last Modified time: 2018-07-06 11:53:44
 * @Description: 游戏选择场景。
 */

module majiang {
	export class MajiangHallScene extends game.BaseHallScene {
		public pmdKey: string = "mjxlch";
		public hallId: string = "scmj";
		//选择游戏滚动窗口
		private select: eui.Scroller;
		private contentGroup: eui.Group;
		//标题
		private sjmj_title: eui.Image;
		//暂时先做成图片的形式，不要要点击效果，等后期迭代的时候在家按钮效果
		private img_ch_down: eui.Image;
		private img_ch_up: eui.Image;
		private img_dd_down: eui.Image;
		private img_dd_up: eui.Image;
		private img_men0: eui.Image;
		private img_men1: eui.Image;
		private rightGroup: eui.Group;
		private playerIcon: eui.Button;

		/**
		 * 头像前缀
		 */
		public headerFront: string = "hall_header";
		/**
		 * 背景音乐
		 */
		public bgMusic: string = "home_bg_mp3";

		/**
		 * 关闭当前界面的通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_MAJIANG_HALL;

		/**
		 * 进入正确匹配的通知
		 */
		public MATCHING_NOTIFY: string = SceneNotify.OPEN_MAJIANG_MATCH;

		/**
		 * 帮助界面的通知
		 */
		public HELP_NOTIFY: string = PanelNotify.OPEN_HELP;

		/**
		 * 记录界面的通知
		 */
		public RECORD_NOTIFY: string = PanelNotify.OPEN_GAMERECORD;

		/**
		 * 设置界面的通知
		 */
		public SETTING_NOTIFY: string = null;

		/**
		 * 需要加载的资源组
		 */
		public loadGroups: string[] = ['majiang_game'];

		public constructor() {
			super();
			this.skinName = new MajiangHallSceneSkin();
		}


		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);
			EventManager.instance.addEvent(EventNotify.CHANG_PLAYER_HEADER, this.changHeader, this);

		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);
			EventManager.instance.removeEvent(EventNotify.CHANG_PLAYER_HEADER, this.changHeader, this);
		}

		private changHeader(e: egret.Event) {
			let data = e.data;
			this.headerImage.source = `${this.headerFront}_${data.sex}_${data.figureUrl}_png`;
			Global.playerProxy.playerData.figure_url = data.figureUrl;
			Global.playerProxy.playerData.sex = data.sex;
		}


		/**
		 * 检查回到界面
		 */
		private checkReconnectScene() {
			let roomState = Global.gameProxy.roomState;
			if (roomState && roomState.state == 1) {
				RotationLoading.instance.load(["majiang_game"], "", () => {
					this.enterScene({ data: roomState });
				});
			}
		}


		/**
		 * 进入匹配或者重新获取数据
		 * @param  {egret.Event} e?
		 */
		public async enterScene(event) {
			var data = event.data;
			RotationLoading.instance.load(this.loadGroups, "", async () => {
				Global.gameProxy.lastGameConfig = data;
				var handler = ServerPostPath.hall_sceneHandler_c_enter;
				let resp: any = await game.PomeloManager.instance.request(handler, data);
				this.enterSceneCall(resp, data);
			})
		}

		/**
		 * 书写逻辑代码
		 */
		private choseType: number;//记录上次选择的游戏种类。
		public createChildren() {
			super.createChildren();
			//给玩家的数据赋值
			this.showName(Global.playerProxy.playerData.nickname);
			//给游戏选场数据列表赋值
			RES.loadGroup("majiang_game");
			RES.loadGroup("majiang_back");
		}

		/**
		 * 渲染按钮
		 */
		public showHallBars() {
			if (Global.gameProxy.gameType == 0) {
				this.choseGameType("mjxlch");
				this.visibleTorF(1);
				Global.gameProxy.diWen = "mjxlch";
			} else if (Global.gameProxy.gameType == 1) {
				this.choseGameType("mjxzdd");
				this.visibleTorF(2);
				Global.gameProxy.diWen = "mjxzdd";
			}
			this.sjmj_title.alpha = 0;
			egret.Tween.get(this.sjmj_title).to({ alpha: 0 }, 50).to({ alpha: 1 }, 600);
			this.rightGroup.x = 1208;
			egret.Tween.get(this.rightGroup).to({ horizontalCenter: 1161 }, 50).to({ horizontalCenter: 70 }, 300);
		}


		/**
		 * @param  {egret.TouchEvent} e父类方法，自己知道调
		 * 全屏的放大
		 *本界面里的所有点击事件。
		 * 
		 */
		private times = 0;//点击次数。
		private msgs;//保存数据。
		public onTouchTap(event: egret.TouchEvent) {
			super.onTouchTap(event);
			switch (event.target) {
				//血流成河 
				case this.img_ch_down:
				case this.img_ch_up:
				case this.img_men0:
					majiang.MajiangUtils.playClick();//管理声音的
					Global.gameProxy.gameType = 0;
					Global.gameProxy.diWen = "mjxlch";
					this.contentGroup.visible = true;
					this.visibleTorF(1);
					this.choseGameType("mjxlch");
					break;
				//血战到底
				case this.img_dd_down:
				case this.img_dd_up:
				case this.img_men1:
					majiang.MajiangUtils.playClick();//管理声音的
					Global.gameProxy.gameType = 1;
					Global.gameProxy.diWen = "mjxzdd";
					this.visibleTorF(2);
					this.choseGameType("mjxzdd");
					break;
				case this.headerImage:
				case this.playerIcon:
					majiang.MajiangUtils.playClick();
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_HEADER);
					break;
			}
		}
		/**
		 * 游戏类型选择，1，血流成河，2血战到底。
		 */
		private choseGameType(gameType) {
			this.contentGroup.removeChildren();
			let index = 0;
			var item: any;
			for (let i in Global.gameProxy.gameNums) {
				if (gameType == i) {
					let games = Global.gameProxy.gameNums[i];
					for (let j in games) {
						item = new MajiangSelectRenderer(games[j], gameType);
						this.contentGroup.addChild(item);
						item.x = item.width / 2 + index * (item.width + 20)
						index++;
						item.alpha = 0;
						egret.Tween.get(item).to({ alpha: 0 }, 100).to({ alpha: 1 }, 200);
					}
				}
			}
		}
		/**
		 * 隐藏or打开
		 */
		private visibleTorF(visibleType) {
			if (visibleType == 1) {
				this.img_ch_down.visible = true;
				this.img_dd_up.visible = true;
				this.img_ch_up.visible = false;
				this.img_dd_down.visible = false;
			} else {
				this.img_ch_down.visible = false;
				this.img_dd_up.visible = false;
				this.img_ch_up.visible = true;
				this.img_dd_down.visible = true;
			}
		}

		private nameDb: eui.Image;
		private goldGroup: eui.Group;
		private showName(nickname) {
			this.nameLabel.text = nickname;
			if (this.nameLabel.width > 200) { //&& this.select_playerName.width <= 300){
				this.nameDb.width = this.nameLabel.width + 40;
				this.nameLabel.size = 20;
			} else if (this.nameLabel.width > 300) {
				this.nameDb.width = this.nameLabel.width;
				this.nameLabel.size = 16;
			} else {
				this.nameLabel.size = 20;
			}
		}
	}
}