class ImageUtils {
	public static showRes(image: eui.Image, name){
		this.getRes(name, (texture)=>{
			image.source = texture
		});
	}

	public static getRes(name, callback) {
		let texture: egret.Texture = RES.getRes(name);
		if (texture) {
			return callback(texture);
		} else {
			RES.getResAsync(name, (texture) => {
				callback(texture);
			}, this);
			return null;
		}

		function createTexture(name: string) {
			let texture: egret.Texture = RES.getRes(name );
			return texture;
		}
	}
}