/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:27:19 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:11:56
 * @Description: 左边玩家出牌集合组
 */
module majiang {
    export class LeftChupaiGroup extends BaseChupaiGroup {
        public chupais: LeftChupai[] = [];
        public constructor() {
            super();
            // this.skinName = new LeftChupaiGroupSkin();
        }

        public createChildren() {
            super.createChildren();

        }

        /**
         * 根据一定的结构算法，显示层级
         */
        public sortByJieGou() {
            var sort = [6, 5, 4, 3, 2, 1, 0];
            this.sortByXIndexByGroup(sort, this.group1);
            this.sortByXIndexByGroup(sort, this.group2);
            this.sortByXIndexByGroup(sort, this.group3);
        }


        public createByArr(arr) {
            for (var i = 0; i < arr.length; i++) {
                var value = arr[i];
                this.createMineChupaiByIndex(i, value);
            }
            // this.sortZorder();
            // this.sortByXIndexByGroup(this.group1);
            // this.sortByJieGou();
        }

        public createMineChupaiByIndex(index, value) {
            //行数
            var row = Math.floor(index / 7) + 1;
            //行数
            var col = index % 7 + 1;
            let mineChupai;
            if (row <= 3) {
                mineChupai = new LeftChupai(value, row, col);
                this['group' + row].addChild(mineChupai);
                mineChupai.setByRecord(this.recordsJson[index + 1]);
                mineChupai.settingColors(index + 1);
            } else {
                row = 3;
                mineChupai = new LeftChupai(value, 3, col);
                mineChupai.useBgSouce();
                mineChupai.x = - 49 - (index - 20) * 4;
                mineChupai.y = 170 + (index - 20) * 31;
                this['group' + 3].addChild(mineChupai);
            }
            this.chupais.push(mineChupai);
            return mineChupai;
        }


        public addChupai(value) {
            let index = this.chupais.length;
            return this.createMineChupaiByIndex(index, value);
        }

        public sortByXIndexByGroup(sort, group: eui.Group) {
            var sortList = [];
            var sortNum = group.numChildren;
            if (group.numChildren > sort.length) {
                sortNum = sort.length
            }
            for (var i = 0; i < sortNum; i++) {
                var item = group.getChildByName("mj" + sort[i]);
                if (item) {
                    sortList.push(item);
                }
            }
            for (var i = 0; i < sortList.length; i++) {
                group.addChild(sortList[i]);
            }
        }
    }
}