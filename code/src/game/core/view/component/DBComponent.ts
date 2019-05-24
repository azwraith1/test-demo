class DBComponent extends game.BaseUI {
	private armature: dragonBones.EgretArmatureDisplay;
	private dnName: string;
	public callback: Function;
	public currentName;
	public constructor(dbName) {
		super();
		this.dnName = dbName;
		this.createDb();

	}

	public resetPosition() {
		this.armature.x = this.width / 2;
		this.armature.y = this.height / 2;
	}

	public onAdded() {
		super.onAdded();
		this.width = this.armature.width;
		this.height = this.armature.height;
	}

	public createDb() {
		let armature: dragonBones.EgretArmatureDisplay = DBFactory.instance.getDBAsync1(this.dnName);

		if (armature) {
			this.armature = armature;
			this.addChild(armature);
			this.armature.addEventListener(egret.Event.COMPLETE, this.completeCall, this);
		}
	}

	private completeCall() {
		if (this.callback) {
			this.callback();
			return;
		}
		game.UIUtils.removeSelf(this);
		GameCacheManager.instance.setCache(this.dnName, this);
	}

	public play(name: string = "default", times: number) {
		this.currentName = name;
		this.visible = true;
		this.armature.animation.play(name, times);
	}

	public play1(name: string = "default", times: number) {
		this.currentName = name;
		this.visible = true;
		this.armature.animation.play(name, times);
	}

	public stop() {

	}

	public playDefault(times: number) {
		this.currentName = "default";
		this.visible = true;
		this.armature.animation.gotoAndPlayByFrame("default", 0, times);
	}


	public playNamesAndLoop(names: string[]) {
		async.eachSeries(names, (name, callback) => {
			this.callback = callback;
			this.play(name, 1);
		}, () => {
			this.play(this.currentName, -1);
		})
	}

		public playNamesAndLoop1(names: string[]) {
		async.eachSeries(names, (name, callback) => {
			this.callback = callback;
			this.play(name, 1);
		}, () => {
			this.play(this.currentName, 3);
		})
	}



	public static create(cacheName, effectName) {
		let component = GameCacheManager.instance.getCache(cacheName);
		if (!component) {
			component = new DBComponent(effectName);
			GameCacheManager.instance.setCache(cacheName, component);
		}
		return component;
	}




	public playByTime(name1, times: number) {
		this.currentName = name1;
		this.visible = true;
		this.armature.animation.gotoAndPlayByFrame(name1, 1, times);
	}

	public play_first(name1, times: number) {
		this.currentName = name1;
		this.armature.animation.gotoAndPlayByFrame(name1, 1, times);

	}

	

	public static dbMovie(name, movieName) {
		var anime_data = RES.getRes(name + "_ske_json");
		var anime_texture = RES.getRes(name + "_tex_png");
		var anime_texture_data = RES.getRes(name + "_tex_json");
		var db: dragonBones.EgretFactory = new dragonBones.EgretFactory();
		db.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(anime_data));
		db.addTextureAtlas(new dragonBones.EgretTextureAtlas(anime_texture, anime_texture_data));
		var anime: dragonBones.EgretArmatureDisplay = db.buildArmatureDisplay(movieName);
		return anime;
	}
}