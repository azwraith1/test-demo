/**
 *
 * @author 
 *
 */
module game {
    export class UIUtils {
        public static removeFromParent(child: egret.DisplayObject) {
            if (child && child.parent) {
                child.parent.removeChild(child);
            }
        }

        /**
        * 设置锚点居中
        * @param compt 组件
        * @param allChild 是否全部child设置锚点居中
        */
        public static setAnchorCenter(compt: egret.DisplayObject, allChild?: boolean): void {
            if (allChild) {
                for (var i = 0; i < compt.parent.numChildren; i++) {
                    if (compt.parent.getChildAt(i).anchorOffsetX == 0) {
                        compt.parent.getChildAt(i).anchorOffsetX = compt.parent.getChildAt(i).width / 2;
                        compt.parent.getChildAt(i).anchorOffsetY = compt.parent.getChildAt(i).height / 2;
                        compt.parent.getChildAt(i).x += compt.parent.getChildAt(i).width / 2;
                        compt.parent.getChildAt(i).y += compt.parent.getChildAt(i).height / 2;
                    }
                }
            } else {
                if (compt.anchorOffsetX == 0) {
                    compt.anchorOffsetX = compt.width / 2;
                    compt.anchorOffsetY = compt.height / 2;
                    compt.x += compt.width / 2;
                    compt.y += compt.height / 2;
                }
            }
        }

        public static resetAnchorPoint(p) {
            p.x -= p.anchorOffsetX;
            p.y -= p.anchorOffsetY;
            p.anchorOffsetX = 0;
            p.anchorOffsetY = 0;
        }

        public static updatePosistion(p: egret.DisplayObjectContainer) {
            if (p.width === GameConfig.WINSIZE_WIDTH) {
                p.width = GameConfig.curWidth();
            }
            if (p.height === GameConfig.WINSIZE_HEIGHT) {
                p.height = GameConfig.curHeight();
            }
        }

        public static addButtonScaleEffects(p: egret.DisplayObjectContainer) {
            if (!p) return;
            if (egret.is(p, egret.getQualifiedClassName(eui.Button))) {
                if (!p.name) {
                    p.addEventListener(egret.TouchEvent.TOUCH_BEGIN, UIUtils.onButtonTouchBegan, p);
                }
                UIUtils.setAnchorPot(p);
            } else {
                // if (!egret.is(p.parent, egret.getQualifiedClassName(eui.Group))) {
                var len = p.numChildren;
                for (var i = 0; i < len; i++) {
                    var ch: egret.DisplayObjectContainer = <egret.DisplayObjectContainer>p.getChildAt(i);
                    UIUtils.addButtonScaleEffects(ch);
                }
                // }
            }
        }

        public static addTouchScaleEffect(p: egret.DisplayObjectContainer) {
            p.addEventListener(egret.TouchEvent.TOUCH_BEGIN, UIUtils.onButtonTouchBegan, p);
        }

        private static onButtonTouchBegan(e: egret.TouchEvent) {
            game.AudioManager.getInstance().playSound("ui_click_mp3");
            var btn = e.target;
            var scaleX = btn.scaleX;
            var scaleY = btn.scaleY;
            egret.Tween.get(btn).to({ scaleX: scaleX - 0.1, scaleY: scaleY - 0.1 }, 50).to({ scaleX: scaleX, scaleY: scaleY }, 50);
        }

        static removeButtonScaleEffects(p: egret.DisplayObjectContainer) {
            if (!p) return;

            if (egret.is(p, egret.getQualifiedClassName(eui.Button))) {
                p.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, UIUtils.onButtonTouchBegan, p);
            } else {
                var len = p.numChildren;
                for (var i = 0; i < len; i++) {
                    var ch: egret.DisplayObjectContainer = <egret.DisplayObjectContainer>p.getChildAt(i);
                    UIUtils.removeButtonScaleEffects(ch);
                }
            }
        }

        static setAnchorPot(p: egret.DisplayObject) {
            if (p.anchorOffsetX || p.anchorOffsetY) {
                return;
            }
            p.anchorOffsetX = p.width / 2// * p.scaleX;
            p.anchorOffsetY = p.height / 2// * p.scaleY;
            p.x += p.width / 2 //* p.scaleX;
            p.y += p.height / 2// * p.scaleY;
        }

        static removeSelf(p: egret.DisplayObject) {
            if (p) {
                UIUtils.removeFromParent(p);
            }
        }

        static removeSelfByAmi(p: egret.DisplayObject, time: number) {
            return new Promise(function (resolve, reject) {
                egret.Tween.get(p).to({
                    alpha: 0
                }, time).call(function () {
                    UIUtils.removeFromParent(p);
                    resolve('success');
                }, p)
            })
        }

        public static getParentByClass(p: egret.DisplayObjectContainer, classType) {
            var parent = p.parent;
            if (parent) {
                if (parent instanceof classType) {
                    return parent;
                } else {
                    return UIUtils.getParentByClass(parent, classType);
                }
            } else {
                return null;
            }
        }


        public static getChildByClass(p: egret.DisplayObjectContainer, classType): any {
            var len = p.numChildren;
            for (var i = 0; i < len; i++) {
                var ch: egret.DisplayObjectContainer = <egret.DisplayObjectContainer>p.getChildAt(i);
                if (ch instanceof classType) {
                    return ch;
                }
            }
            return null;
        }

        //全屏适配方法，给最大的外层做适配，里面的直接勾
        public static fullscreen(p: egret.DisplayObject) {
            // if (GameConfig.curStage().orientation == egret.OrientationMode.PORTRAIT) {
            //      p.width = GameConfig.curWidth();
            //     p.height = GameConfig.curHeight();
            // } else {
            //     p.width = GameConfig.curWidth();
            //     p.height = GameConfig.curHeight();
            // }
            p.width = GameConfig.curWidth();
            p.height = GameConfig.curHeight();
        }


        public static getRealWidth(p: egret.DisplayObject) {
            return p.width * p.scaleX;
        }

        public static getRealHeight(p: egret.DisplayObject) {
            return p.height * p.scaleY;
        }

        /**
         * 设置组件居中X
         * @param  {egret.DisplayObject} p
         */
        public static setUI2CenterX(p: egret.DisplayObject) {
            p.x = GameConfig.curWidth() / 2 - p.width / 2;
        }

        /**
         * 设置组件居中Y
         * @param  {egret.DisplayObject} p
         */
        public static setUI2CenterY(p: egret.DisplayObject) {
            p.y = GameConfig.curHeight() / 2 - p.height / 2;
        }


        public static lockObject(p: egret.DisplayObject) {
            p.touchEnabled = false;
            egret.setTimeout(() => {
                p.touchEnabled = true;
            }, this, 1000);
        }

        /**
         * 窗口全屏
         */
        public static windowFullscreen() {
            if (NativeApi.instance.isiOSDevice) {
                TipsCompoment.instance.show("苹果系统无法全屏，推荐chrome浏览器");
                return;
            }
            TipsCompoment.instance.show("若游戏无法全屏请使用浏览器自带全屏功能.");
            if (window.parent && window.parent['screenfull']) {
                window.parent['screenfull'].enabled && window.parent['screenfull'].toggle();
                return;
            }
            window['screenfull'].enabled && window['screenfull'].toggle();
        }


        public static changeOritation1(isShu: boolean) {
            if (isShu) {
                GameConfig.curStage().orientation = egret.OrientationMode.PORTRAIT;
            } else {
                GameConfig.curStage().orientation = egret.OrientationMode.LANDSCAPE;
            }
        }

        public static isPortait1() {
            return GameConfig.curStage().orientation == egret.OrientationMode.PORTRAIT
        }

        /**
         * 1---横屏 1280 * 720
         * 2---竖屏 720 * 1280
         */
        public static changeResize(model: number) {
            switch (model) {
                case 1:
                    if (egret.Capabilities.isMobile) {
                        egret.MainContext.instance.stage.orientation = egret.OrientationMode.LANDSCAPE;
                    }
                    GameConfig.CURRENT_ISSHU = false;
                    egret.MainContext.instance.stage.setContentSize(1280, 720);
                    break;
                case 2:
                    if (egret.Capabilities.isMobile) {
                        egret.MainContext.instance.stage.orientation = egret.OrientationMode.PORTRAIT;
                    }
                    GameConfig.CURRENT_ISSHU = true;
                    egret.MainContext.instance.stage.setContentSize(720, 1280);
                    break;
            }
        }
        static resizeTimeout;
        static lock: boolean;
        static checkFull1() {
            let windowParent = window.parent;
            if (windowParent && windowParent['checkSafiraStart']) {
                // console.log(window.innerHeight + "," + window.innerWidth + "," + windowParent['maxHeight'] + " , " + windowParent['minWidth']);
                egret.clearTimeout(this.resizeTimeout);
                windowParent.onresize = () => {
                    if (this.lock) {
                        return;
                    }
                    this.lock = true;
                    this.resizeTimeout = egret.setTimeout(() => {
                        this.lock = false;
                        //当前角度
                        let thisRotation = windowParent.orientation;
                        //窗口变化过后safari的高度
                        let onResizeHeight = windowParent.innerHeight;
                        if (thisRotation == 90 || thisRotation == -90) {
                            // console.log("HTIGHT" + onResizeHeight + " , " + windowParent['maxHeight']);
                            if (onResizeHeight == windowParent['maxHeight']) {
                                if (windowParent['gameStart']) {
                                    FrameUtils.postMessage('1');
                                    return;
                                } else {
                                    windowParent['needShow'] = false;
                                    return;
                                }
                            } else {
                                if (windowParent['gameStart']) {
                                    FrameUtils.postMessage('0');
                                    return;
                                } else {
                                    windowParent['needShow'] = true;
                                    return;
                                }
                            }
                        } else {
                            if (thisRotation == 0) {
                                if (windowParent['minWidth'] == null) {
                                    windowParent['minWidth'] = windowParent.innerHeight;
                                }
                                // console.log(windowParent['lastRotation']  + "tt");
                                if (windowParent['lastRotation'] == 90 || windowParent['lastRotation'] == -90) {
                                    if (windowParent['gameStart']) {
                                        // if (NativeApi.instance.isIphoneX || NativeApi.instance.isiPhoneIOS10) {
                                        FrameUtils.postMessage('0');
                                        // return;
                                        // }
                                    } else {
                                        windowParent['needShow'] = true;
                                        return;
                                    }
                                } else {
                                    if (NativeApi.instance.isiPhoneIOS10) {
                                        // console.log("ios10" + NativeApi.instance.isiPhoneIOS10)
                                        if (window.innerHeight == windowParent['minWidth']) {
                                            if (windowParent['gameStart']) {
                                                FrameUtils.tipsToggle();
                                            } else {
                                                windowParent['needShow'] = false;
                                            }
                                            return;
                                        }
                                    }
                                    // console.log(window.innerHeight > windowParent['minWidth']);
                                    if (window.innerHeight > windowParent['minWidth']) {
                                        if (windowParent['gameStart']) {
                                            FrameUtils.postMessage('1');
                                            return;
                                        } else {
                                            windowParent['needShow'] = false;
                                        }
                                    } else {
                                        if (windowParent['gameStart']) {
                                            FrameUtils.postMessage('0');
                                        } else {
                                            windowParent['needShow'] = true
                                        }
                                    }
                                }
                            }
                        }
                        windowParent['lastRotation'] = thisRotation;
                    }, this, 500);
                }
            }
        }

    }
}