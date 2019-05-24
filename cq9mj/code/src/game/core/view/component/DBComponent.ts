class DBComponent extends game.BaseUI {
	private armature: dragonBones.EgretArmatureDisplay;
	private dnName: string;
	public callback: Function
	public constructor(dbName) {
		super();
		this.dnName = dbName;
		this.createDb();
		this.armature.addDBEventListener(egret.Event.COMPLETE, this.completeCall, this);
	}

	public onAdded(){
		super.onAdded();
		this.width = this.armature.width;
		this.height = this.armature.height;
	}

	public createDb() {
		let armature: dragonBones.EgretArmatureDisplay = DBFactory.instance.getDBAsync1(this.dnName);
		this.armature = armature;
		this.addChild(armature);
	}

	private completeCall() {
		if(this.callback){
			this.callback();
			return;
		}
		game.UIUtils.removeSelf(this);
		GameCacheManager.instance.setCache(this.dnName, this);
	}

	public play(name: string = "default", times: number) {
		this.armature.animation.play(name, times);
	}

	public playDefault(times: number) {
		this.armature.animation.gotoAndPlayByFrame("default", 0, times);
	}

}