/**
  * 面板弹出管理类
  * 面板弹出的管理类
  */
module PopUpManager {

    export var darkSprite: egret.Sprite;

    /**
    * 添加面板方法
    * panel       		面板
    * dark        		背景是否变黑
    * popUpWidth      	指定弹窗宽度，定位使用
    * popUpHeight      	指定弹窗高度，定位使用
    * effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
    export function addPopUp(panel, dark: boolean = false, popUpWidth: number = 0, popUpHeight: number = 0, effectType: number = 0, isAlert: boolean = false): void {
        if (GameLayerManager.gameLayer().panelLayer.contains(panel)) {//判断是否包含panel
            return;
        }
        panel.name = "Panel" + panel.hashCode;
        panel.scaleX = 1;
        panel.scaleY = 1;
        panel.x = 0;
        panel.y = 0;
        panel.alpha = 1;
        // dark = false;
        if (dark) {
            var darkSprite = new egret.Sprite();
            darkSprite.graphics.clear();
            darkSprite.graphics.beginFill(0x000000, 0.65);
            darkSprite.graphics.drawRect(0, 0, GameConfig.curWidth(), GameConfig.curHeight());
            darkSprite.graphics.endFill();
            darkSprite.name = "Drak" + panel.hashCode;
            darkSprite.width = GameConfig.curWidth();
            darkSprite.height = GameConfig.curHeight();
            if (!GameLayerManager.gameLayer().panelLayer.contains(darkSprite)) {
                GameLayerManager.gameLayer().panelLayer.addChild(darkSprite);
            }
            darkSprite.touchEnabled = true;

            egret.Tween.get(darkSprite).to({ alpha: 1 }, 150);
            darkSprite.visible = true;
        }

        GameLayerManager.gameLayer().panelLayer.addChild(panel);
        GameConfig.curPanel = panel;
        if (popUpWidth != 0) {
            panel.x = GameConfig.curWidth() / 2 - popUpWidth / 2;
            panel.y = GameConfig.curHeight() / 2 - popUpHeight / 2 - panel.anchorOffsetY;
        } else {
            popUpWidth = panel.width;
            popUpHeight = panel.height;
        }

        //以下是弹窗动画
        var leftX: number = GameConfig.curWidth() / 2 - popUpWidth / 2;
        var upY: number = GameConfig.curHeight() / 2 - popUpHeight / 2;

        switch (effectType) {
            case 0:
                break;
            case 7:
                panel.alpha = 0;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                panel.x = panel.x + popUpWidth / 4;
                panel.y = panel.y + popUpHeight / 4;
                egret.Tween.get(panel).to({ alpha: 1, scaleX: 1, scaleY: 1, x: panel.x - popUpWidth / 4 + panel.anchorOffsetX, y: panel.y - popUpHeight / 4 + panel.anchorOffsetY }, 600, egret.Ease.elasticOut);
                break;
            case 1:
                panel.alpha = 0;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                panel.x = panel.x + popUpWidth / 4;
                panel.y = panel.y + popUpHeight / 4;
                egret.Tween.get(panel).to({ alpha: 1, scaleX: 1, scaleY: 1, x: panel.x - popUpWidth / 4 + panel.anchorOffsetX, y: panel.y - popUpHeight / 4 + panel.anchorOffsetY }, 300, egret.Ease.backOut);
                break;
            case 2:
                panel.alpha = 0;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                egret.Tween.get(panel).to({ alpha: 1, scaleX: 1, scaleY: 1, x: panel.x, y: panel.y }, 600, egret.Ease.elasticOut);
                break;
            case 3:
                if (isAlert) {
                    panel.x = - popUpWidth;
                    egret.Tween.get(panel).to({ x: leftX }, 500, egret.Ease.cubicOut);
                } else {
                    panel.x = - popUpWidth;
                    egret.Tween.get(panel).to({ x: 0 }, 500, egret.Ease.cubicOut);
                }
                break;
            case 4:
                if (isAlert) {
                    panel.x = popUpWidth;
                    egret.Tween.get(panel).to({ x: leftX }, 500, egret.Ease.cubicOut);
                } else {
                    panel.x = popUpWidth;
                    egret.Tween.get(panel).to({ x: 0 }, 500, egret.Ease.cubicOut);
                }
                break;
            case 5:
                if (isAlert) {
                    panel.y = - popUpHeight;
                    egret.Tween.get(panel).to({ y: upY }, 500, egret.Ease.cubicOut);
                } else {
                    panel.y = - popUpHeight;
                    egret.Tween.get(panel).to({ y: 0 }, 500, egret.Ease.cubicOut);
                }
                break;
            case 6:
                if (isAlert) {
                    panel.y = GameConfig.curHeight();
                    egret.Tween.get(panel).to({ y: upY }, 500, egret.Ease.cubicOut);
                } else {
                    panel.y = popUpHeight;
                    egret.Tween.get(panel).to({ y: 0 }, 500, egret.Ease.cubicOut);
                }
                break;
            default:
                break;
        }

    }

    export function removePopUpAsync(panel, effectType: number = 0) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var darkName = "Drak" + panel.hashCode;
            var darkSprite = GameLayerManager.gameLayer().panelLayer.getChildByName(darkName);
            var onComplete: Function = function () {
                if (GameLayerManager.gameLayer().panelLayer.contains(darkSprite)) {
                    GameLayerManager.gameLayer().panelLayer.removeChild(darkSprite);
                }
            };
            if (darkSprite) {
                egret.Tween.get(darkSprite).to({ alpha: 0 }, 100).call(onComplete, self);
            }

            //以下是弹窗动画
            switch (effectType) {
                case 0:
                    break;
                case 1:
                    egret.Tween.get(panel).to({ alpha: 0, scaleX: 0, scaleY: 0, x: panel.x + panel.width / 2, y: panel.y + panel.height / 2 }, 300);
                    break;
                case 2:
                    break;
                case 3:
                    egret.Tween.get(panel).to({ x: panel.width }, 500, egret.Ease.cubicOut);
                    break;
                case 4:
                    egret.Tween.get(panel).to({ x: -panel.width }, 500, egret.Ease.cubicOut);
                    break;
                case 5:
                    egret.Tween.get(panel).to({ y: panel.height }, 500, egret.Ease.cubicOut);
                    break;
                case 6:
                    egret.Tween.get(panel).to({ y: -panel.height }, 500, egret.Ease.cubicOut);
                    break;
                default:
                    break;
            }

            var waitTime = 500;
            if (effectType == 0) {
                waitTime = 0;
            }
            egret.setTimeout(function () {
                if (GameLayerManager.gameLayer().panelLayer.contains(panel)) {//判断是否包含panel
                    GameLayerManager.gameLayer().panelLayer.removeChild(panel);
                    // panel = null;
                    resolve();
                }
            }, self, waitTime);
        });
    }

    /**
    * 移除面板方法
    * panel       		面板
    * effectType        0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
    export function removePopUp(panel, effectType: number = 0) {
        var darkName = "Drak" + panel.hashCode;
        var darkSprite = GameLayerManager.gameLayer().panelLayer.getChildByName(darkName);
        var onComplete: Function = function () {
            if (GameLayerManager.gameLayer().panelLayer.contains(darkSprite)) {
                GameLayerManager.gameLayer().panelLayer.removeChild(darkSprite);
            }
        };
        if (darkSprite) {
            egret.Tween.get(darkSprite).to({ alpha: 0 }, 100).call(onComplete, this);
        }

        //以下是弹窗动画
        switch (effectType) {
            case 0:
                break;
            case 1:
                egret.Tween.get(panel).to({ alpha: 0, scaleX: 0, scaleY: 0 }, 300);
                break;
            case 2:
                break;
            case 3:
                egret.Tween.get(panel).to({ x: panel.width }, 500, egret.Ease.cubicOut);
                break;
            case 4:
                egret.Tween.get(panel).to({ x: -panel.width }, 500, egret.Ease.cubicOut);
                break;
            case 5:
                egret.Tween.get(panel).to({ y: panel.height }, 500, egret.Ease.cubicOut);
                break;
            case 6:
                egret.Tween.get(panel).to({ y: -panel.height }, 500, egret.Ease.cubicOut);
                break;
            default:
                break;
        }

        var waitTime = 500;
        if (effectType == 0) {
            waitTime = 0;
        }
        egret.setTimeout(function () {
            if (GameLayerManager.gameLayer().panelLayer.contains(panel)) {//判断是否包含panel
                GameLayerManager.gameLayer().panelLayer.removeChild(panel);
                panel = null;
            }
        }, this, waitTime);
    }


    /**
        * 添加场景
        * panel       		面板
        * dark        		背景是否变黑
        * popUpWidth      	指定弹窗宽度，定位使用
        * popUpHeight      	指定弹窗高度，定位使用
        * effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
        */
    export function addSceneUp(scene, effectType: number = 0, isAlert: boolean = false): void {
        if (GameLayerManager.gameLayer().sceneLayer.contains(scene)) {//判断是否包含panel
            return;
        }
        GameLayerManager.gameLayer().sceneLayer.addChild(scene);
    }


    export function removeSceneUp(scene) {
        if (GameLayerManager.gameLayer().sceneLayer.contains(scene)) {//判断是否包含panel
            GameLayerManager.gameLayer().sceneLayer.removeChild(scene);
        }
    }

    /**
     * 显示重要提示
     * @param txt
     */
    export function popTip(txt: string, time: number = 1000, isHtml: boolean = false) {
        game.ToastTip.popTip(txt, time, isHtml);
    }

}


