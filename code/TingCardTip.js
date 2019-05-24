// const _ = require('lodash');

var TingCardTip = {};
var root = typeof(window) != "undefined" ? window : module.exports;
root.TingCardTip = TingCardTip;

TingCardTip.getTings = function (cards, selectColor, pengCards, gangCards) {
    var tings = [];
    if (!checkTingOrHuCondition(cards, selectColor)) {
        return tings;
    }
    
    for (var key in _.values(Color)) {
        var color = _.values(Color)[key];
        if (color == selectColor) continue;
        var cardNum = ColorCardNum[color];
        if(!cardNum){
            continue;
        }
        for (var p = 1, pm = cardNum.point; p <= pm; ++p) {
            var card = getValue(color, p);
            if (cards[card] === 4) {
                continue;
            }

            var tmpCards = _.clone(cards);
            ExObject.addNumber(tmpCards, card, 1);
            var data22 = checkHuLogic(tmpCards, card, pengCards, gangCards);
            var pattern = data22.pattern;
            var rulePattern = data22.rulePattern;
            if (pattern != Pattern.NONE) {
                var gangFan = gangCards && gangCards.length || 0;
                // 七对不计算杠番
                if (pattern != Pattern.PAIR7 &&
                    pattern != Pattern.PAIR7_LONG &&
                    pattern != Pattern.PAIR7_COLOR &&
                    pattern != Pattern.PAIR7_COLOR_LONG &&
                    pattern != Pattern.JiangDui7) {
                    pengCards && pengCards.forEach(function (card) {
                        if (tmpCards[card]) {
                            gangFan++;
                        }
                    });

                    gangFan += ExObject.countEQ(tmpCards, 4);
                }

                
                tings.push({value: card, fan: PatternScore[pattern] + gangFan + ItemScore[rulePattern]});
            }
        }
    }
    return tings;
};

const ExObject = {
    countEQ: function (obj, value) {
        var count = 0;
        this.each(obj, function (k, v) {
            if (v == value) {
                count++;
            }
        });
        return count;
    },

    numberKeys: function (obj) {
        var keys = _.keys(obj);
        for (var i = 0, l = keys.length; i < l; ++i) {
            keys[i] = +(keys[i]);
        }
        return keys;
    },

    eachKeyNum: function (obj, callback) {
        var keys = _.keys(obj);
        for (var i = 0, len = keys.length; i < len; ++i) {
            var k = keys[i];
            if (callback(+k, obj[k]) === false) break;
        }
    },

    /**
     * 当obj的key的值当作数字 +value，如果没有该key则会自动添加
     * @param obj
     * @param key
     * @param value
     */
    addNumber: function (obj, key, value) {
        obj[key] = (+obj[key] || 0) + value;
    },

    /**
     * 将obj的所有数字类型的值进行累加
     * @param obj
     * @returns {number}
     */
    sumValue: function (obj) {
        var sum = 0;
        var keys = _.keys(obj);
        for (var i = 0, len = keys.length; i < len; ++i) {
            var value = obj[keys[i]];
            if (!isNaN(value)) {
                sum += (+value);
            }
        }
        return sum;
    },

    /**
     * 遍历obj对象的成员
     * @param obj
     * @param callback(key, value) 返回true则退出遍历
     */
    each: function (obj, callback) {
        var keys = _.keys(obj);
        for (var i = 0, len = keys.length; i < len; ++i) {
            var k = keys[i];
            if (callback(k, obj[k]) === false) break;
        }
    },
};

const COLOR_CARD_NUM = 9;              // 每种花色有多少张牌

const Color = {    // 花色
    'TONG': 1,  // 筒
    'TIAO': 2,  // 条
    'WAN': 3,   // 万
};

const ColorCardNum = {};
ColorCardNum[Color.TONG] = {point: COLOR_CARD_NUM, num: 4};
ColorCardNum[Color.TIAO] = {point: COLOR_CARD_NUM, num: 4};
ColorCardNum[Color.WAN] = {point: COLOR_CARD_NUM, num: 4};

const Pattern = { // 基础牌型
    'NONE': 0,                // 不是可胡的牌型
    'NORMAL': 1,              // 平胡
    'PAIR': 2,                // 大对
    'PAIR7': 3,               // 七对
    'SINGLE': 4,              // 单调

    'NORMAL_COLOR': 15,      // 清一色

    'PAIR_COLOR': 25,        // 清对

    'PAIR7_LONG': 32,       // 龙七对
    'PAIR7_COLOR': 35,      // 清七对
    'PAIR7_COLOR_LONG': 37,// 清龙对

    'DaiYaoJiu': 201,           // 全幺九
    'JiangDui': 202,            // 将对
    'JiangDui7': 203,           // 将七对

    'MenQing': 211,             // 门清
    'ZhongZhang': 212,          // 中张
};

const PatternScore = {};
PatternScore[Pattern.NORMAL] = 0;
PatternScore[Pattern.PAIR] = 1;
PatternScore[Pattern.PAIR7] = 2;
PatternScore[Pattern.NORMAL_COLOR] = 2;
PatternScore[Pattern.PAIR_COLOR] = 3;
PatternScore[Pattern.PAIR7_LONG] = 3;
PatternScore[Pattern.PAIR7_COLOR] = 4;
PatternScore[Pattern.PAIR7_COLOR_LONG] = 5;

PatternScore[Pattern.DaiYaoJiu] = 3;
PatternScore[Pattern.JiangDui] = 3;
PatternScore[Pattern.JiangDui7] = 4;

PatternScore[Pattern.MenQing] = 1;
PatternScore[Pattern.ZhongZhang] = 1;

const ScoreRule = {
    NONE:0,
    SINGLE: 207, // 大单调
};

const ItemScore = {};
ItemScore[ScoreRule.NONE] = 0;
ItemScore[ScoreRule.SINGLE] = 1;

/**
 * 根据花色和点数计算牌值
 * @param color
 * @param point
 * @returns {*}
 */
function getValue(color, point) {
    return color * 10 + point;
}

function checkTingOrHuCondition(cards, selectColor) {
    // 定缺
    if (selectColor != null) {
        if (existColor(cards, selectColor)) {
            return false;
        }
    }

    return true;
}

/**
 * 从牌值计算花色
 * @param value
 * @returns {number}
 */
function getColor(value) {
    return Math.floor(value / 10);
}


var Value = {};
Value.TONG1 = getValue(Color.TONG, 1);
Value.TONG9 = getValue(Color.TONG, 9);
Value.TIAO1 = getValue(Color.TIAO, 1);
Value.TIAO9 = getValue(Color.TIAO, 9);
Value.WAN1 = getValue(Color.WAN, 1);
Value.WAN9 = getValue(Color.WAN, 9);

/**
 * 计算牌组中牌的张数
 * @param cards
 * @returns {*}
 */
function sumCardsNum(cards) {
    return ExObject.sumValue(cards);
}

/**
 * 判断牌级中是否有指定花色的牌
 * @param cards
 * @param color
 * @returns {boolean}
 */
function existColor(cards, color) {
    var exist = false;
    ExObject.each(cards, function (card, num) {
        if (getColor(card) == color) {
            exist = true;
            return false;
        }
    });
    return exist;
}

/**
 * 从牌组中获取指定花色的子牌组
 * @param cards
 * @returns {object}
 */
function getColorCards(cards, color) {
    var colorCards = {};
    for (var card = getValue(color, 1), max = card + ColorCardNum[color].point; card < max; ++card) {
        var num = cards[card];
        if (num) {
            colorCards[card] = num;
        }
    }
    return colorCards;
}

function baseCheckHuLogic(cards, huCard) {
    var num4 = 0;
    var num3 = 0;
    var num2 = 0;
    var num = 0;

    ExObject.each(cards, function (c, n) {
        if (n == 2) {
            num2++;
        } else if (n == 3) {
            num3++;
        } else if (n == 4) {
            num4++;
        }
        num += n;
    });

    if (num == 2) { // 单调
        return (num2 == 1) ? Pattern.SINGLE : Pattern.NONE;
    }

    if ((num2 + num4 * 2) == 7) { // 七对
        return Pattern.PAIR7;
    }

    if (num2 == 1 && (num3 * 3 + 2) == num) { // 大对子
        return Pattern.PAIR;
    }

    var colors = [Color.TONG, Color.TIAO, Color.WAN];
    var pattern = Pattern.NORMAL;
    var isExistJiang = false;
    for (var i = 0, l = colors.length; i < l; ++i) {
        var color = colors[i];
        var colorCards = getColorCards(cards, color);
        var context = checkHuColorCards(getValue(color, 1), getValue(color, COLOR_CARD_NUM), colorCards);
        if (!context.result) {
            pattern = Pattern.NONE;
            break;
        }

        if (i > 0 && isExistJiang && context.isExistJiang) {
            pattern = Pattern.NONE;
            break;
        }

        if (isExistJiang == false) {
            isExistJiang = context.isExistJiang;
        }
    }
    return pattern;
}

function checkHuLogic(cards, huCard, pengCards, gangCards) {
    var pattern = baseCheckHuLogic(cards, huCard);
    var rulePattern = 0;
    if (pattern == Pattern.NONE) {
        return {pattern:pattern, rulePattern:rulePattern};
    }

    if (pattern == Pattern.SINGLE) {
        pattern = Pattern.PAIR;
        rulePattern = ScoreRule.SINGLE;
    }

    var colors = getColorsWithCards(cards, pengCards, gangCards);

    var exPattern = 0;
    if (colors.length == 1) { // 清一色
        exPattern = 5;
    }

    if (pattern == Pattern.PAIR7) {
        if (ExObject.countEQ(cards, 4) > 0) {
            exPattern += 2;
        }
    }

    if (exPattern) {
        pattern = pattern * 10 + exPattern;
    }

    return {pattern:pattern, rulePattern:rulePattern};
}

function checkHuColorCards(minCard, maxCard, colorCards) {
    var colorCardsNum = sumCardsNum(colorCards);
    var context = {result: false, isExistJiang: false};

    if (colorCardsNum == 0) {
        context.result = true;
        return context;
    }


    var modNum = colorCardsNum % 3;
    if (modNum == 0) {
        checkHu3X(minCard, maxCard, colorCards, context);
    } else if (modNum == 2) {
        checkHu3X2(minCard, maxCard, colorCards, context);
        context.isExistJiang = true;
    }

    return context;
}

function getColorsWithCards(cards, pengCards, gangCards) {
    var colors = {};

    ExObject.eachKeyNum(cards, function (card, num) {
        colors[getColor(card)] = 1;
    });

    pengCards && pengCards.forEach(function (card) {
        colors[getColor(card)] = 1;
    });

    gangCards && gangCards.forEach(function (card) {
        if (card) {
            colors[getColor(card)] = 1;
        }
    });

    return ExObject.numberKeys(colors);
}

function checkHu3X(minCard, maxCard, cards, context) {
    if (sumCardsNum(cards) < 1) {
        context.result = true;
        return;
    }

    for (var i = minCard; i <= maxCard; ++i) {
        var num = cards[i];
        if (!num) {
            continue;
        }

        var num2 = cards[i + 1];
        var num3 = cards[i + 2];

        if (num == 3) {
            if (num2 >= 3 && num3 >= 3) {
                var newCards = _.clone(cards);
                newCards[i] = 0;
                newCards[i + 1] = num2 - 3;
                newCards[i + 2] = num3 - 3;
                checkHu3X(minCard, maxCard, newCards, context);
            }

            cards[i] = 0;
            checkHu3X(minCard, maxCard, cards, context);
        } else {
            if (num2 && num3) {
                cards[i] = num - 1;
                cards[i + 1] = num2 - 1;
                cards[i + 2] = num3 - 1;
                checkHu3X(minCard, maxCard, cards, context);
            }
        }
        break;
    }
}
 
function checkHu3X2(minCard, maxCard, cards, context) {
    for (var i = minCard; i <= maxCard; ++i) {
        var num = cards[i];
        if (num >= 2) {
            var newCards = _.clone(cards);
            newCards[i] = num - 2;
            checkHu3X(minCard, maxCard, newCards, context);
            if (context.result) break;
        }
    }
}