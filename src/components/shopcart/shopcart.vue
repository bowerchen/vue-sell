<template>
<div>
    <div class="shopCart">
        <div class="content">
            <div class="content-left" @click="toggleList">
                <div class="logo-wrapper" >
                    <div class="logo" :class="{'highlight': this.totalCount > 0}">
                        <i class="icon-shopping_cart"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">
                        {{totalCount}}
                    </div>
                </div>
                <div class="price" :class="{'highlight': this.totalPrice > 0}">
                    ￥{{totalPrice}}
                </div>
                <div class="desc">
                    另需配送费￥{{deliveryPrice}}元
                </div>
            </div>
            <div class="content-right" :class="payClass">
                <div class="pay">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="balls-wrapper">
            <div v-for="(ball, index) in balls" :key="index">
                <transition @before-enter="beforeDrop"
                            @enter="dropping"
                            @after-enter="afterDrop">
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>
        </div>
        <transition tag="div" name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header border-1px">
                    <h2 class="name">购物车</h2>
                    <div class="empty" @click="empty">清空</div>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li v-for="(food, index) in selectFoods" :key="index" class="food-list">
                            <div class="name">{{food.name}}</div>
                            <div class="info">
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
    <transition name="fade">
        <div class="list-mark" v-show="listShow" @click="toggleList"></div>
    </transition>
</div>
</template>

<script>
import cartcontrol from 'components/cartcontrol/cartcontrol'
import BScroll from 'better-scroll'

const BALL_LENGTH = 10;
const innerClsHook = 'inner-hook'

function createBalls() {
    let balls = []
    for (let i = 0; i < BALL_LENGTH; i++) {
        balls.push( { show: false } )
    }
    return balls
}

export default {
    name: 'shopCart',
    data() {
        return {
            balls: createBalls(),
            fold: true
        }
    },
    created() {
        this.dropBalls = []
    },
    props: {
        deliveryPrice: {
            type: Number,
            default() {
                return 0
            }
        },
        minPrice: {
            type: Number,
            default() {
                return 0
            }
        },
        selectFoods: {
            type: Array,
            default() {
                return []
            }
        }
    },
    computed: {
        totalPrice() {
            let price = 0
            this.selectFoods.forEach((food) => {
                price += food.price * food.count
            })
            return price
        },
        totalCount() {
            let count = 0
            this.selectFoods.forEach((food) => {
                count += food.count
            })
            return count
        },
        payDesc() {
            if (this.totalPrice === 0) {
                return `还差￥${this.minPrice}起送`
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}起送`
            } else {
                return '去结算'
            }
        },
        payClass() {
            if (!this.totalCount || this.totalPrice < this.minPrice) {
                return 'not-enough'
            } else  {
                return 'enough'
            }
        },
        listShow() {
            if (!this.totalCount) {
                this.fold = true
                return false
            }
            let show = !this.fold
            if (show) {
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        })
                    } else {
                        this.scroll.refresh();
                    }
                });
            }
            return show
        }
    },
    methods: {
        drop(el) {
            for (let i = 0; i < this.balls.length; i++) {
                const ball = this.balls[i]
                if (!ball.show) {
                    ball.show = true
                    ball.el = el
                    this.dropBalls.push(ball)
                    return
                }
            }
        },
        beforeDrop(el) {
            const ball = this.dropBalls[this.dropBalls.length - 1]
            const rect = ball.el.getBoundingClientRect()
            const x = rect.left - 32
            const y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
            const inner = el.getElementsByClassName(innerClsHook)[0]
            inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
        },
        dropping(el, done) {
            this._reflow = document.body.offsetHeight
            el.style.transform = el.style.webkitTransform = 'translate3d(0,0,0)'
            const inner = el.getElementsByClassName(innerClsHook)[0]
            inner.style.transform = inner.style.webkitTransform = 'translate3d(0,0,0)'
            el.addEventListener('transitionend', done)
        },
        // 该事件不生效，为什么？ 答案找到了，因为在css设置了.v-enter类导致无法生效
        afterDrop(el) {
            const ball = this.dropBalls.shift()
            if (ball) {
                ball.show = false
                el.style.display = 'none'
            }
        },
        toggleList() {
            if (!this.totalCount) {
                return
            }
            this.fold = !this.fold
        },
        empty() {
            this.selectFoods.forEach((food) => {
                food.count = 0
            })
        }
    },
    components: {
        cartcontrol
    }
}
</script>

<style lang="scss">
@import "~common/sass/mixin.scss";
@import "~common/sass/common.scss";

.shopCart {
    position: fixed;
    bottom: 0;
    left: 0;
    min-width: 100%;
    height: 48px;
    z-index: 99;
    background: #000;
    .content {
        display: flex;
        .content-left {
            flex: 1;
            font-size: 0;
            background: #141d27;
            .logo-wrapper {
                display: inline-block;
                position: relative;
                top: -10px;
                margin: 0 12px;
                padding: 6px;
                width: 56px;
                height: 56px;
                box-sizing: border-box;
                vertical-align: top;
                border-radius: 50%;
                background: #141d27;
                .logo {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2d343c;
                    text-align: center;
                    &.highlight {
                        background: #00a0dc;
                        .icon-shopping_cart {
                            color: white;
                        }
                    }
                    .icon-shopping_cart {
                        font-size: 24px;
                        line-height: 44px;
                        color: #80858a;
                    }
                }
                .num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 24px;
                    height: 16px;
                    line-height: 16px;
                    font: {
                        size: 9px;
                        weight: 700;
                    };
                    color: #fff;
                    background: rgb(240,20,20);
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
                }
            }
            .price {
                display: inline-block;
                vertical-align: top;
                margin-top: 12px;
                line-height: 24px;
                padding-right: 12px;
                font-size: 16px;
                color: rgba(255,255,255,0.4);
                font-weight: 700;
                border-right: 1px solid rgba(255,255,255,0.1);
                &.highlight {
                    color: white;
                }
            }
            .desc {
                display: inline-block;
                vertical-align: top;
                margin: 12px 0 0 12px;
                line-height: 24px;
                font-size: 12px;
                font-weight: 500;
                color: rgba(255,255,255,0.4);
            }
        }
        .content-right {
            flex: 0 0 105px;
            text-align: center;
            &.not-enough {
                background: #2b333b;
                .pay {
                    color: rgba(255,255,255,0.4);
                }
            }
            &.enough {
                background: #00b43c;
                .pay {
                    color: #fff;
                }
            }
            .pay {
                line-height: 48px;
                font-size: 12px;
                font-weight: 700;
            }
        }
    }
    .balls-wrapper {
        .ball {
            position: fixed;
            left: 32px;
            bottom: 22px;
            z-index: 200;
            transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
            .inner {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: rgb(0,160,220);
                transition: all 0.4s linear;
            }
        }
    }
    .shopcart-list {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: -1;
        transform: translate3d(0, -100%, 0);
        &.fold-enter-active, &.fold-leave-active  {
            transition: all 0.5s linear;
        }
        &.fold-enter, &.fold-leave-active {
            transition: all 0.5s linear;
            transform: translate3d(0,0,0);
        }
        .list-header {
            padding: 0 18px;
            height: 40px;
            line-height: 40px;
            background: #f3f5f7;
            @include border-1px(rgb(7,17,27,0.3));
            .name {
                margin: 0;
                float: left;
                font: {
                    size: 14px;
                    weight: 200;
                }
                color: rgb(7,17,27)
            }
            .empty {
                float: right;
                font-size: 12px;
                color: rgb(0,160,220);
            }
        }
        .list-content {
            padding: 0 18px;
            max-height: 217px;
            overflow: hidden;
            background: #fff;
            .food-list {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 48px;
                @include border-1px(rgba(7,17,27,0.1));
                &:last-child {
                    @include border-none();
                }
                .name {
                    font-size: 14px;
                    color: rgb(7,17,27);
                    line-height: 24px;
                }
                .info {
                    .price {
                        display: inline-block;
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 24px;
                        color: rgb(240,20,20);
                    }
                    .cartcontrol-wrapper {
                        display: inline-block;
                        margin: 0 0 0 12px;
                    }
                }
            }
        }
    }
}

.list-mark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7,17,27,0.6);
    transition: all 0.5s;
    z-index: 51;
    &.fade-enter-active, &.fade-leave-active {
        opacity: 1;
    }
    &.fade-enter, &.fade-leave {
        opacity: 0;
    }
}

</style>
