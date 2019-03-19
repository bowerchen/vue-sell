<template>
    <div class="goods-wrapper">
        <div class="goods-menu" ref="menuWrapper">
            <ul class="menu-list">
                <li v-for="(good, index) in goods" :key="index" class="menu-item" :class="{'current': currentIndex===index}" @click="selectMenu(index, $event)">
                    <span class="text">
                        <support-icon v-show="good.type >= 1" :size="3" :type="good.type"></support-icon>{{good.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="goods-list-wrap" ref="foodWrapper">
            <ul>
                <li v-for="(good,index) in goods" :key="index" class="good-item good-item-hook">
                    <div class="title">
                        <p class="text">{{good.name}}</p>
                    </div>
                    <ul>
                        <li v-for="(food,index) in good.foods" :key="index" @click="selectFood(food, $event)" class="food-item border-1px">
                            <div class="food-icon">
                                <img :src="food.icon" :alt="food.name">
                            </div>
                            <div class="food-info">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="description">{{food.description}}</p>
                                <div class="extra">
                                    <span class="sellcount">月销售{{food.sellCount}}份</span>
                                    <span class="rating">好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="new">￥{{food.price}}</span>
                                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                                </div>
                            </div>
                            <div class="cartControl-wrapper">
                                <cartControl @cart_add="onAdd" :food="food"></cartControl>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopCart ref="shopCart" :selectFoods="this.selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopCart>
        <food @cart_add="onAdd" :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
import { getGoods } from 'api'
import supportIcon from 'components/support-icon/support-icon'
import BScroll from 'better-scroll'
import shopCart from 'components/shopcart/shopcart'
import cartControl from 'components/cartcontrol/cartcontrol'
import food from 'components/food/food'

export default {
    name: 'goods',
    props: {
        data: {
            type: Object,
            default() {
                return {}
            }
        },
        seller: {
            type: Object
        }
    },
    data() {
        return {
            goods: [],
            foods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {}
        }
    },
    methods: {
        // 初始化滚动条
        _initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true
            })
            this.foodScroll = new BScroll(this.$refs.foodWrapper, {
                probeType: 3,
                click: true
            })

            this.foodScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y))
            })
        },
        // 计算每个区间的Y值
        _calculateHeight() {
            let foodList = this.$refs.foodWrapper.getElementsByClassName('good-item-hook')
            let height = 0
            this.listHeight.push(height)
            for (let i = 0; i < foodList.length; i++) {
                height += foodList[i].clientHeight
                this.listHeight.push(height)
            }
        },
        selectMenu(index, event) {
            if (!event._constructed) {
                return
            }
            let foodList = this.$refs.foodWrapper.getElementsByClassName('good-item-hook')

            let el = foodList[index]

            this.foodScroll.scrollToElement(el, 300)
        },
        onAdd(target) {
            this.$nextTick(() => {
                this.$refs.shopCart.drop(target)
            })
        },
        selectFood(food, e) {
            if (!e._constructed) {
                return
            }
            this.selectedFood = food
            this.$refs.food.show()
        }
    },
    computed: {
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                // 获取区间上下范围
                let height1 = this.listHeight[i]
                let height2 = this.listHeight[ i + 1 ]
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i
                }
            }
            return 0
        },
        selectFoods() {
            let foods = []
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) {
                        foods.push(food)
                    }
                })
            })
            return foods
        }
    },
    created() {
        getGoods({
            id: this.seller.id
        }).then((goods) => {
            this.goods = goods
            this.$nextTick(() => {
                this._initScroll()
                this._calculateHeight()
            })
        })
    },
    components: {
        supportIcon,
        shopCart,
        cartControl,
        food
    }
}
</script>

<style lang="scss">
@import "~common/sass/variable.scss";
@import "~common/sass/mixin.scss";

.goods-wrapper {
    display: flex;
    position: absolute;
    top: 175px;
    bottom: 46px;
    width: 100%;
    // height: calc(100% - 48px);
    overflow: hidden;
    .goods-menu {
        flex: 0 0 80px;
        width: 80px;
        height: calc(100% - 48px);
        background: nth($bg-white, 1);
        .menu-list {
            width: 100%;
            .menu-item {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 54px;
                padding: 0 6px;
                list-style: none;
                text-align: center;
                box-sizing: border-box;
                @include border-1px(nth($border-color, 1));
                &.current {
                    background: $white;
                    @include border-none();
                    .text {
                        color: black;
                        font-weight: 700;
                    }
                }
                .text {
                    .support-ico {
                        display: inline-block;
                        vertical-align: top;
                        margin-right: 2px;
                    }
                    vertical-align: top;
                    font-size: 12px;
                    font-weight: 200;
                    color: nth($black, 2);
                    line-height: 14px;
                }
            }
        }
    }
    .goods-list-wrap {
        flex: 1;
        width: 100%;
        height: 100%;
        .good-item {
            .title {
                height: 26px;
                border-left: 2px solid nth($border-color, 3);
                background-color: $bg-white;
                line-height: 26px;
                .text {
                    padding-left: 14px;
                    font-size: 12px;
                    color: $grey1;
                    margin: 0;
                }
            }
            .food-item {
                display: flex;
                flex-direction: row;
                margin: 18px;
                padding-bottom: 18px;
                @include border-1px(nth($border-color, 1));
                &:last-child {
                    @include border-none();
                    margin-bottom: 18px;
                }
                .food-icon {
                    flex: 0 0 57px;
                    margin-right: 10px;
                    img {
                        width: 57px;
                    }
                }
                .food-info {
                    flex: 1;
                    .name {
                        margin: 2px 0 6px 0;
                        font-size: 14px;
                        line-height: 14px;
                        color: rgb(7,17,27);
                    }
                    .description {
                        font-size: 8px;
                        line-height: 12px;
                        color: rgb(147,153,159);
                        margin-bottom: 8px;
                    }
                    .extra {
                        @extend .description;
                        white-space: nowrap;
                        .sellcount {
                            margin-right: 12px;
                        }
                    }
                    .price {
                        line-height: 24px;
                        font-weight: 700;
                        .new {
                            font-size: 14px;
                            color: rgb(240,20,20);
                            margin-right: 8px;
                        }
                        .old {
                            font-size: 10px;
                            color: rgb(147,153,159);
                            text-decoration: line-through;
                        }
                    }
                }
                .cartControl-wrapper {
                    position: absolute;
                    right: 16px;
                    bottom: 16px;
                }
            }
        }
    }
}
</style>
