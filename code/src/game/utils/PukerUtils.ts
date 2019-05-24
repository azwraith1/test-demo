/*
 * @Author: li mengchan 
 * @Date: 2018-10-18 15:26:45 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-12-04 15:35:09
 * @Description: 扑克工具类
 */
class PukerUtils {

	/**
	 * 数字转扑克值
	 * @param  {} number
	 */
	public static number2Puker(number) {
		if (number > 1 && number <= 10) {
			return number;
		} else if (number == 11) {
			return "J";
		} else if (number == 12) {
			return "Q";
		} else if (number == 13) {
			return "K";
		} else {
			return "A";
		}
	}

	/**
	 * 0没事 1通吃 -1通赔
	 * 判断通输或者通吃
	 */
	public static checkTongShuOrChi(records) {
		let group = _.groupBy(records, (record: any) => {
			return record.gainGold > 0;
		});
	}


	public static showZJTongChi(effectGroup: eui.Group) {
		let db: DBComponent = GameCacheManager.instance.getCache("tongchi");
		if (!db) {
			db = new DBComponent("tongchi");
			GameCacheManager.instance.setCache("tongchi", db);
		}
		db.callback = () => {
			game.UIUtils.removeSelf(db);
			GameCacheManager.instance.setCache("tongchi", db);
		};
		effectGroup.addChild(db);
		db.verticalCenter = db.height / 2 - 150;
		db.horizontalCenter = db.width / 2;
		db.playDefault(1);
	}


	public static showZJTongPei(effectGroup: eui.Group) {
		let db: DBComponent = GameCacheManager.instance.getCache("tongpei");
		if (!db) {
			db = new DBComponent("tongpei");
		}
		db.callback = () => {
			game.UIUtils.removeSelf(db);
			GameCacheManager.instance.setCache("tongpei", db);
		};
		effectGroup.addChild(db);
		db.verticalCenter = db.height / 2 - 150;
		db.horizontalCenter = db.width / 2;
		db.playDefault(1);
	}

	public static showZJTongChi_sg(effectGroup: eui.Group) {
		let db: DBComponent = GameCacheManager.instance.getCache("pai_tongchi");
		if (!db) {
			db = new DBComponent("pai_tongchi");
			GameCacheManager.instance.setCache("pai_tongchi", db);
		}
		db.callback = () => {
			db.callback = () => { game.UIUtils.removeSelf(db); };
			db.play("xunhuan", 1);
		};
		effectGroup.addChild(db);
		db.verticalCenter = db.height / 2 - 150;
		db.horizontalCenter = db.width / 2;
		db.play("kaishi", 1);
	}


	public static showZJTongPei_sg(effectGroup: eui.Group) {
		let db: DBComponent = GameCacheManager.instance.getCache("pai_tongpei");
		if (!db) {
			db = new DBComponent("pai_tongpei");
		}
		db.callback = () => {
			game.UIUtils.removeSelf(db);
			GameCacheManager.instance.setCache("pai_tongpei", db);
		};
		effectGroup.addChild(db);
		db.verticalCenter = db.height / 2 - 150;
		db.horizontalCenter = db.width / 2;
		db.playDefault(1);
	}
}