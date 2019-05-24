/**
 * 龙骨动画的管理器
 * 	单列模式i
 * 	使用龙骨动画的工厂模式
 */
class DragonBonesManager {
	public constructor() {
	}
	private static instance: DragonBonesManager;
	public static getInstance(): DragonBonesManager {
		if (this.instance == null) {
			this.instance = new DragonBonesManager();
		}
		return this.instance;
	}
	private factory: dragonBones.EgretFactory;
	// public loadObj: egret.DisplayObjectContainer;
	/**
 	 * 龙骨动画的展示和播放
 	 *@param loadObj  添加龙骨动画的父容器
 	 *@param dragonbonesDataName  添加龙骨动画的名称
 	 *@param dragonbonesData 数据源
 	 *@param  textureData   图片的数据源
 	 *@param texture 图片的名称
 	 *@param dragonName  数据名称
 	 *@param aniName  需要的动画名称
 	 *@param xs   x的位置
 	 *@param ys   y的位置
 	 *@param playTimes   播放次数
 	 *@param timeScale 播放的速率
 	 *@param isAppend  是否需要回调函数
 	 *@param dragonbonesName 动画名称
  	 */
	public startDragon(loadObj: egret.DisplayObjectContainer, dragonbonesDataName: string, dragonbonesData: string, textureData: string, texture: string, dragonName: string, aniName: string, xs: number, ys: number, playTimes: number, timeScale: number = 1, isAppend: boolean = false, dragonbonesName: string = "dragonbones"): void {
		if (this.factory == null) {
			this.factory = new dragonBones.EgretFactory();//实例化龙骨动画工厂类
		}
		// let dragon: dragonBones.DragonBonesData = dragonBones.DataParser.parseDragonBonesData(RES.getRes(dragonbonesData));
		let dragon = this.factory.getDragonBonesData(dragonbonesDataName)
		if (dragon == null) {
			let dragon1: dragonBones.DragonBonesData = dragonBones.DataParser.parseDragonBonesData(RES.getRes(dragonbonesData));
			this.factory.addDragonBonesData(dragon1);
		}
		let textureAtlasData = this.factory.getTextureAtlas(dragonbonesDataName);
		if (textureAtlasData == null) {
			let textureAtlasData1: dragonBones.TextureAtlasData = new dragonBones.EgretTextureAtlas(RES.getRes(texture), RES.getRes(textureData))
			this.factory.addTextureAtlas(textureAtlasData1);
		}
		//直接生成骨骼动画显示对象，该对象实现IArmatureDisplay接口
		let armature: dragonBones.EgretArmatureDisplay = this.factory.buildArmatureDisplay(dragonName);
		armature.animation.timeScale = timeScale;
		armature.animation.play(aniName, playTimes);
		armature.x = xs;
		armature.y = ys;
		armature.once(egret.Event.COMPLETE, oncomplete, this);
		armature.name = dragonbonesName;
		loadObj.addChild(armature);

		function oncomplete() {
			if (!isAppend) {
				loadObj.removeChild(armature);
			}
			armature.removeEventListener(egret.Event.COMPLETE, oncomplete, this)

		}

	}
}