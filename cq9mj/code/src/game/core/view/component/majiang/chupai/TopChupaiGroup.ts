/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:27:19 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:11:43
 * @Description: 本家出牌集合组
 */
module majiang {
    export class TopChupaiGroup extends BaseChupaiGroup {
        public chupais: TopChupai[] = [];
        public constructor() {
            super();
            // this.skinName = new TopChupaiGroupSkin();
        }

        public createChildren() {
            super.createChildren();
        }

        /**
         * 根据一定的结构算法，显示层级
         */
        public sortByJieGou() {
            var sort = [0, 1, 2, 3, 6, 5, 4];
            this.sortByXIndexByGroup(sort, this.group1);
            this.sortByXIndexByGroup(sort, this.group2);
            this.sortByXIndexByGroup(sort, this.group3);
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
            var rows = Math.floor(index / 7) + 1;
            //列数
            var col = index % 7 + 1;
            let mineChupai;
            if (rows <= 3) {
                mineChupai = new TopChupai(value);
                mineChupai.initWithIndex(rows);
                this['group' + rows].addChild(mineChupai);
                mineChupai.setByRecord(this.recordsJson[index + 1]);
                mineChupai.settingColors(index + 1);
            } else {
                mineChupai = new TopChupai(value);
                mineChupai.initWithIndex(21);
                rows = 3;
                mineChupai.y = -1;
                mineChupai.x = -(index - 20) * 37;
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