<template>
<transition name="move">
    <div class="food-wrapper" v-show="showFlag" ref="food">
        <div class="content">
            <div class="food-header">
                <div class="food-image">
                    <img :src="food.image" alt="产品图片">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
            </div>
            <div class="food-content">
                <div class="details">
                    <div class="name">{{food.name}}</div>
                    <div class="data">
                        <span class="sellerCount">月售{{food.sellCount}}</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="new">￥{{food.price}}</span>
                        <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartControl-wrapper">
                        <cartControl @cart_add="addFood" :food="food" ></cartControl>
                    </div>
                    <transition name="fade">
                        <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">
                            <span>加入购物车</span>
                        </div>
                    </transition>
                </div>
                <split></split>
                <div class="present" v-show="food.info">
                    <div class="name">
                        <span>商品介绍</span>
                    </div>
                    <div class="info">
                        <span>{{food.info}}</span>
                    </div>
                </div>
                <split v-show="food.info"></split>
                <div class="rating">
                    <div class="name">
                        <span>商品评价</span>
                    </div>
                    <ratingSelected @rating_select="ratingSelect"  @content_rating="ratingContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingSelected>
                    <div class="rating-list">
                        <ul v-show="food.ratings && food.ratings.length ">
                            <li v-for="(rating, index) in food.ratings" v-show="needShow(rating.rateType, rating.text)" :key="index" class="rating-item border-1px">
                                <div class="user">
                                    <span>{{rating.username}}</span>
                                    <img :src="rating.avatar" alt="用户头像">
                                </div>
                                <div class="content">
                                    <div class="time">{{rating.rateTime | formatDate}}</div>
                                    <div class="text">
                                        <i class="icon" :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
                                        <span>{{rating.text}}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div v-show="!(food.ratings && food.ratings.length)" class="no-rating">
                            暂无评论
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
import BScroll from 'better-scroll'
import Vue from 'vue'
import cartControl from 'components/cartcontrol/cartcontrol'
import split from 'components/split/split'
import ratingSelected from 'components/ratingselected/ratingselected'
import { formatDate } from 'common/js/date'

const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
    props: {
        food: {
            type: Object,
            default() {}
        }
    },
    data() {
        return {
            showFlag: false,
            selectType: ALL,
            onlyContent: false,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    methods: {
        show() {
            this.showFlag = true
            this.selectType = ALL
            this.onlyContent = false
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.food, {
                        click: true
                    })
                } else {
                    this.scroll.refresh()
                }
            })
        },
        hide() {
            this.showFlag = false
        },
        addFirst(e) {
            if (!e._constructed) {
                return
            }
            this.$emit('cart_add', e.target)
            Vue.set(this.food, 'count', 1)
        },
        needShow(type, text) {
            if (this.onlyContent && !text) {
                return false
            }
            if (this.selectType === ALL) {
                return true
            } else {
                return type === this.selectType
            }
        },
        ratingSelect(type) {
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        ratingContent() {
            this.onlyContent = !this.onlyContent;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        addFood(target) {
            this.$emit('cart_add', target)
        }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
        cartControl,
        split,
        ratingSelected
    }
}
</script>

<style lang="scss">
@import "~common/sass/mixin.scss";
@import "~common/sass/common.scss";

    .food-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 48px;
        width: 100%;
        height: calc(100% - 48px);
        background: #fff;
        z-index: 30;
        transition: all 0.5s linear;
        &.move-enter-active {
            transform: translate3d(0, 0, 0);
        }
        &.move-enter, &.move-leave-active {
            transform: translate3d(100%, 0, 0);
        }
        .food-header {
            .food-image {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 100%;
                img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }
                .back {
                    position: absolute;
                    top: 10px;
                    left: 0;
                    .icon-arrow_lift {
                        display: block;
                        padding: 10px;
                        font-size: 20px;
                        color: #fff;
                    }
                }
            }
        }
        .food-content {
            .details {
                position: relative;
                padding: 18px;
                .name {
                    font: {
                        size: 14px;
                        weight: 700;
                    }
                    line-height: 14px;
                    color: rgb(7, 17, 27);
                }
                .data {
                    margin: 8px 0 16px 0;
                    font-size: 10px;
                    font-weight: 200;
                    color: rgb(147, 153, 159);
                    line-height: 10px;
                    .sellerCount {
                        padding: 0 12px 0 0;
                    }
                }
                .price {
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
                .cartControl-wrapper {
                    position: absolute;
                    right: 15px;
                    bottom: 13px;
                }
                .buy {
                    position: absolute;
                    right: 18px;
                    bottom: 18px;
                    padding: 0 12px;
                    box-sizing: border-box;
                    background: rgb(0, 160, 220);
                    height:24px;
                    line-height: 24px;
                    text-align: center;
                    border-radius: 12px;
                    z-index: 5;
                    span {
                        font-size: 10px;
                        color: #fff;
                    }
                    &.fade-enter-active, &.fade-leave-active {
                        opacity: 1;
                        transition: all 0.2s;
                    }
                    &.fade-enter, &.fade-leave {
                        opacity: 0;
                    }
                }
            }
            .present {
                position: relative;
                padding: 18px;
                .name {
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 14px;
                    color: rgb(7, 17, 27);
                    margin-bottom: 6px;
                }
                .info {
                    font-size: 12px;
                    line-height: 14px;
                    font-weight: 200;
                    color: rgb(77, 85, 93);
                    padding: 0 6px;
                }
            }
            .rating {
                padding-top: 18px;
                .name {
                    font-size: 14px;
                    font-weight: 700px;
                    line-height: 14px;
                    margin-left: 18px;
                }
                .rating-list {
                    .rating-item {
                        position: relative;
                        padding: 16px 18px;
                        @include border-1px(rgb(7,17,27,0.1));
                        .time {
                            font-size: 10px;
                            color: rgb(147,153,159);
                            line-height: 12px;
                        }
                        .text {
                            display: flex;
                            align-items: center;
                            padding-top: 6px;
                            font-size: 0;
                            .icon {
                                font-size: 12px;
                                line-height: 24px;
                                padding-right: 4px;
                                &.icon-thumb_up {
                                    color: rgb(0,160,220);
                                }
                                &.icon-thumb_down {
                                    color: rgb(147,153,159);
                                }
                            }
                            span {
                                font-size: 12px;
                                line-height: 16px;
                                color: rgb(7,17,27);
                                font-weight: 700;
                            }
                        }
                        .user {
                            position: absolute;
                            right: 16px;
                            top: 16px;
                            span {
                                font-size: 10px;
                                color: rgba(147, 153, 159);
                                line-height: 12px;
                                padding-right: 6px;
                            }
                            img {
                                width: 12px;
                                height: 12px;
                            }
                        }
                    }
                }
            }
            .no-rating {
                padding: 0 16px;
                color: rgba(147, 153, 159);
                font-size: 12px;
                line-height: 14px;
            }
        }
    }
</style>
