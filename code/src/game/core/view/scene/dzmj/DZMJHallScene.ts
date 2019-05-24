/*
 * @Author: He Bing 
 * @Date: 2018-07-03 14:11:47 
 * @Last Modified time: 2018-07-06 11:53:44
 * @Description: 游戏选择场景。
 */

module majiang {
	export class DZMJHallScene extends game.BaseHallScene {
		public pmdKey: string = "dzmj";
		public hallId: string = "dzmj";
		private selectGroup: eui.Group;
		private headerMask: eui.Image;

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
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_DZMJ_HALL;

		/**
		 * 进入正确匹配的通知
		 */
		public MATCHING_NOTIFY: string = SceneNotify.OPEN_DZMJ_MATCHING;

		/**
		 * 帮助界面的通知
		 */
		public HELP_NOTIFY: string = PanelNotify.OPEN_DZMJ_HELP;

		/**
		 * 记录界面的通知
		 */
		public RECORD_NOTIFY: string = PanelNotify.OPEN_DZMJRECORD;

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
			this.skinName = new majiang.DZMJHallSceneSkin();
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
		 * 获取对局信息
		 * @param  {egret.Event} e?
		 */
		public async enterScene(e) {
			var data = e.data;
			RotationLoading.instance.load(["majiang_game"], "", async () => {
				Global.gameProxy.lastGameConfig = data;
				Global.gameProxy.lastGameConfig.gameId = data.gameId;
				var handler = ServerPostPath.hall_sceneHandler_c_enter;
				data['isContinue'] = false;
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
			this.headerImage.mask = this.headerMask;
			this.createDb();
		}

		private dbGroup: eui.Group;
		private createDb() {
			let dbComponent = GameCacheManager.instance.getCache("dzmj_bg") as DBComponent;
			if (!dbComponent) {
				dbComponent = new DBComponent(`dzmj_bg`);
				dbComponent.touchEnabled = false;
			}
			dbComponent.playDefault(0);
			this.dbGroup.addChild(dbComponent);
			dbComponent.resetPosition();
			dbComponent.y = 100;
		}


		public showHallBars() {
			var nums = Global.gameProxy.gameNums["dzmj"];
			let index = 1;
			var item: any;
			for (let i in nums) {
				let barConfig = nums[i];
				item = new DZMJHallBar(nums[i], index, "dzmj");
				item.name = "item" + i;
				this.selectGroup.addChild(item);
				item.x = 40 + item.width / 2 + (index - 1) * (item.width)
				index++;
				item.alpha = 1;
				egret.Tween.get(this.selectGroup).to({
					alpha: 1
				}, 800);
			}
		}
	}
}