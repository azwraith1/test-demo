/*
 * @Author: wangtao 
 * @Date: 2019-04-12 11:11:18 
 * @Last Modified by: wangtao
 * @Last Modified time: 2019-04-22 19:41:11
 * @Description: 
 */
module game {
    export class GoldDownPanel {
        private num;
        private stop_bigWin_rect: eui.Rect;
        private goldPool: Array<any> = [];
        public constructor(num: number) {
            this.num = num;
        }
        protected createChildren() {

            //   this.createGoldPool();
            this.stop_bigWin_rect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendStopMessage, this);
        }
        /**
         * @param  {} name
         * 创建name名的金币动画
         */
        public static createGold(name) {
            let gold_big = ObjectPool.produce(name, null);
            if (!gold_big) {
                gold_big = new DBComponent(name);          
                gold_big.scaleY = 1;
                gold_big.scaleX = 1;
            }
            gold_big.callback = () => {
                game.UIUtils.removeSelf(gold_big);
                ObjectPool.reclaim(name, gold_big);
            }
            gold_big.play("", 1);
            gold_big.x = 700;
            gold_big.y = Math.ceil(Math.random() * 200)+150;
            gold_big.touchEnabled = false;
			gold_big.touchChildren = false;
            return gold_big;
        }
        /**
         * @param  {} name
         * 创建name名的金币动画
         */
        public static createLeftGold(name) {
            let gold_big = ObjectPool.produce(name, null);
            if (!gold_big) {
                gold_big = new DBComponent(name)
                gold_big.scaleY = 1;
                gold_big.scaleX = 1;
            }
            gold_big.callback = () => {
                game.UIUtils.removeSelf(gold_big);
                ObjectPool.reclaim(name, gold_big);
            }
            gold_big.play("", 1);
            gold_big.x = 700;
            gold_big.y = Math.ceil(Math.random() * 200)+150;
            gold_big.touchEnabled = false;
			gold_big.touchChildren = false;
            return gold_big;
        }

         public static createsdxlGold(name) {
            let gold_big = ObjectPool.produce(name, null);
            if (!gold_big) {
                gold_big = new DBComponent(name)         
                gold_big.scaleY = 1;
                gold_big.scaleX = 1;
            }
            gold_big.callback = () => {
                game.UIUtils.removeSelf(gold_big);
                ObjectPool.reclaim(name, gold_big);
            }
            gold_big.play("", 1);
            gold_big.x = 640;
            gold_big.y = Math.ceil(Math.random() * 200)+ 250;
            gold_big.touchEnabled = false;
			gold_big.touchChildren = false;
            return gold_big;
        }
         /**
         * @param  {} name
         * 创建name名的金币动画
         */
        public static createsdLeftGold(name) {
            let gold_big = ObjectPool.produce(name, null);
            if (!gold_big) {
                gold_big = new DBComponent(name)
                gold_big.scaleY = 1;
                gold_big.scaleX = 1;
            }
            gold_big.callback = () => {
                game.UIUtils.removeSelf(gold_big);
                ObjectPool.reclaim(name, gold_big);
            }
            gold_big.play("", 1);
            gold_big.x = 640;
            gold_big.y = Math.ceil(Math.random() * 200) + 250;
            gold_big.touchEnabled = false;
			gold_big.touchChildren = false;
            return gold_big;
        }
        
        // public static createMidGold() {
        //     let gold_mid = new DBComponent("coin_mid");
        //     gold_mid.play("", 1);
        //     gold_mid.x = Math.ceil(Math.random() * 1280);
        //     gold_mid.y = Math.ceil(Math.random() * 300);

        //     gold_mid.scaleX = 0.8;
        //     gold_mid.scaleY = 1;
        //     return gold_mid;
        // }
        // public static createSmallGold() {
        //     let gold_small = new DBComponent("coin_small");
        //     gold_small.play("", 1);
        //     gold_small.x = Math.ceil(Math.random() * 1280);
        //     gold_small.y = Math.ceil(Math.random() * 400);

        //     gold_small.scaleX = 0.8;
        //     gold_small.scaleY = 1;
        //     return gold_small;
        // }

        public sendStopMessage() {
            EventManager.instance.dispatch(EventNotify.LAOHU_GOLD_DOWN);
        }
        //免费游戏bingwin效果
        public static addFreeGameBigwin(num) {
        }
    }
}