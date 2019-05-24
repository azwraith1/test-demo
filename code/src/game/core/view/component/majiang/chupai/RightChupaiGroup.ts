/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:27:19 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:11:37
 * @Description: 右边玩家出牌集合组
 */
module majiang {
    export class RightChupaiGroup extends BaseChupaiGroup {
        public chupais: RightChupai[] = [];
        public constructor() {
            super();
            // this.skinName = new majiang.RightChupaiGroupSkin();
        }

        public createChildren() {
            super.createChildren();
        }

        /**
         * 根据一定的结构算法，显示层级
         */
        public sortByJieGou() {
            this.sortByXIndexByGroup(this.group1);
            this.sortByXIndexByGroup(this.group2);
            this.sortByXIndexByGroup(this.group3);
        }

        public createByArr(arr) {
            for (var i = 0; i < arr.length; i++) {
                var value = arr[i];
                this.createMineChupaiByIndex(i, value);
            }
            // this.sortByXIndexByGroup(this.group1);
            this.sortByJieGou();
        }

        public createMineChupaiByIndex(index, value) {
            //行数
            var row = Math.floor(index / 7) + 1;
            //行数
            var col = index % 7 + 1;
            let mineChupai;
            if (row <= 3) {
                mineChupai = new RightChupai(value, row, col);
                this['group' + row].addChild(mineChupai);
                mineChupai.setByRecord(this.recordsJson[index + 1]);
                mineChupai.index = index;
                // this.sortByXIndexByGroup(this['group' + row]);
                mineChupai.settingColors(index + 1);
            } else {
                row = 3;
                mineChupai = new RightChupai(value, 3, col);
                mineChupai.useBgSouce();
                mineChupai.x = 14 - (index - 20) * 3;
                mineChupai.y = (index - 20) * -28;
                this['group' + 3].addChild(mineChupai);
                mineChupai.index = index;
                //  this.sortByXIndexByGroup(this['group' + row]);
            }
            this.chupais.push(mineChupai);
            return mineChupai;
        }

        public addChupai(value) {
            let index = this.chupais.length;
            let majiang = this.createMineChupaiByIndex(index, value);
            // this.sor
            this.sortByJieGou();
            return majiang;
        }

        public sortByXIndexByGroup(group: eui.Group) {
            // var sortList = [];
            // for (var i = group.numChildren - 1; i >= 0; i--) {
            //     let index: any = i;
            //     var item = group.getChildAt(index);
            //     if (item) {
            //         sortList.push(item);
            //     }
            // }
            for (var i = this.chupais.length - 1; i >= 0; i--) {
                this.chupais[i].parent.addChild(this.chupais[i]);
            }
            // for (var i = 0; i < sortList.length; i++) {
            //     group.addChild(sortList[i]);
            // }
        }
    }
}