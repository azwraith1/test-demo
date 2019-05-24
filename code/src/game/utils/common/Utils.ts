module game {
	export class Utils {
		/**
		 * 数组元素坐标对换
		 * @param  {any[]} arr
		 * @param  {} value1
		 * @param  {} value2
		 */
		public static arrChangePos(arr: any[], value1, value2) {
			var pos1 = arr.indexOf(value1);
			var pos2 = arr.indexOf(value2);
			arr.splice(pos1, 1, ...arr.splice(pos2, 1, arr[pos1]));
		}


        /**
         * 获取从min-max之间的值
         * @param min
         * @param max
         */
		public static rang(min: number, max: number): number {
			return Math.round(Math.random() * (max - min) + min);
		}

        /**
         * 判断是否在范围
         * @param val
         * @param min
         * @param max
         * @returns {boolean}
         */
		public static isRang(val: number, min: number, max: number): boolean {
			return val >= min && val <= max;
		}

		/**
		* 产生包含min,max的随机数
		* @param min 最小值
		* @param max 最大值
		* @param isFloat 是否返回Float值
		* @param decimal 保留小数位 默认保留2位小数
		* @returns {number} 数值
		*/
		public static random(min: number, max: number, isFloat?: boolean, decimal?: number): number {
			return isFloat ? (min + parseFloat((Math.random() * (max - min)).toFixed(decimal ? decimal : 2))) : (min + Math.round(Math.random() * (max - min)));
		}
        /**
         * 将val的值限制起来
         * @param val
         * @param min
         * @param max
         * @returns {number}
         */
		public static limit(val: number, min: number, max: number): number {
			return Math.max(min, Math.min(max, val));
		}

        /**
         * 角度转化弧度
         * @param val
         */
		public static ang2rad(val: number): number {
			return val / 180 * Math.PI;
		}

        /**
         * 弧度转化角度
         * @param val
         */
		public static rad2ang(val: number): number {
			return val / Math.PI * 180;
		}

        /**
         * 返回大数据的显示方式
         * @param num
         * @returns {string}
         */
		static getBigNumberShow(num: number): string {
			if (num < 10000) {
				return num + "";
			} else {
				num /= 1000;
				return num.toFixed(1) + "K";
			}
		}

        /**
         * 元素是否包含在Array里
         * @param el
         * @param arr
         * @returns {boolean}
         */
		static isElinArr(el: any, arr: any[]) {
			return arr.indexOf(el) > -1;
		}

        /**
         * 2个Array是否有相交元素
         * @param arr1
         * @param arr2
         */
		static isArrCrossing(arr1: any[], arr2: any[]) {
			for (var i = 0; i < arr1.length; i++) {
				if (Utils.isElinArr(arr1[i], arr2)) {
					return true;
				}
			}
			return false;
		}

        /**
         * 从地址上获取key
         * @param name {string} 要获取的key名称
         * @returns {string} key值
         * @platform Web
         * @code utf-8
         */
		public static getURLQueryString(name: string): string {
			if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
				var url: string = decodeURIComponent(window.location.href);
				url = url.replace(/&quot/g, "\"");
				var r;
				if (url.indexOf("#?") > 0) {
					url = url.replace("#?", "&");
					r = url.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
				} else {
					r = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"))
				}
				return r ? r[2] : null;
			}
		}


		public static S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		
		public static guid() {
			return (Utils.S4()+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+Utils.S4()+Utils.S4());
		}

		public static getMaxStr(str: string) {
			if (str.length <= 5) {
				return str;
			}
			return str.substr(0, 5) + "...";
		}

		public static removeArrayItem(arr: Array<any>, item: any) {
			var index = arr.indexOf(item);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}

		/**
* 两矩形碰撞
* @param x1 {number} 方1x
* @param y1 {number} 方1y
* @param w1 {number} 方1宽
* @param h1 {number} 方1高
* @param x2 {number} 方2x
* @param y2 {number} 方2y
* @param w2 {number} 方2宽
* @param h2 {number} 方2高
*/
		public static isCollsionRect2(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
			return ((x1 >= x2 && x1 >= x2 + w2) || (x1 <= x2 && x1 + w1 <= x2) || (y1 >= y2 && y1 >= y2 + h2) || (y1 <= y2 && y1 + h1 <= y2)) ? false : true;
		}

		public static rect1CollsionRect2(rect1: egret.Rectangle, rect2: egret.Rectangle) {
			return Utils.isCollsionRect2(rect1.x, rect1.y, rect1.width, rect1.height, rect2.x, rect2.y, rect2.width, rect2.height);
		}

		public static getRotationXy(r, rotaion) {
			var result;
			var rad = Utils.ang2rad(90 - Math.abs(rotaion));
			if (rotaion < 0) {
				result = {
					x: (r * Math.cos(rad)),
					y: (r * Math.sin(rad))
				};
			} else {
				result = {
					x: - (r * Math.cos(rad)),
					y: (r * Math.sin(rad))
				};
			}
			return result;
		}


		public static valueEqual(value1, value2) {
			return value1.toString() == value2.toString();
		}


		public static sleepTime(time: number) {
			return new Promise((resolove, rejecr) => {
				egret.setTimeout(() => {
					resolove();
				}, this, time);
			});
		}

		/**
		 * 勾股定理
		 */
		public static ggdl(x1, y1, x2, y2) {
			let lengthX = Math.abs(x1 - x2);
			let lengthY = Math.abs(y1 - y2);
			return Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2));


		}
	}
}