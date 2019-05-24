class ObjectPool {
	private static cacheDict: Object = {};
	/**生产*/
	public static produce(cacheName: string, clazz: any) {
		let cacheArr = ObjectPool.cacheDict[cacheName];
		if (!cacheArr) {
			cacheArr = [];
		}
		if (cacheArr.length > 0) {
			let one = cacheArr.shift();
			return one;
		} else {
			return null;
		}
	}
	/**回收*/
	public static reclaim(cacheName: string, obj: any): void {
		let cacheArr = ObjectPool.cacheDict[cacheName];
		if (!cacheArr) {
			ObjectPool.cacheDict[cacheName] = [];
		}
		ObjectPool.cacheDict[cacheName].push(obj);
	}
}