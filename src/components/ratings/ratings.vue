<template>
    <div class="ratings" ref="ratings">
        <div class="cotnent">
            <div class="overview-wrapper">
                <div class="overview-left border-1px">
                    <div class="score">{{seller.score}}</div>
                    <div class="grade">综合评分</div>
                    <div class="percent">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score service-score">
                        <span class="title">服务评价</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="text">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score food-score">
                        <span class="title">美食评价</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="text">{{seller.foodScore}}</span>
                    </div>
                    <div class="score delivery-time">
                        <span class="title">送达时间</span>
                        <span class="time">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingSelected @rating_select="ratingSelect" @content_rating="ratingContent" :onlyContent="onlyContent" :selectType="selectType" :ratings="ratings"></ratingSelected>
            <div class="rating-list">
                <ul v-show="ratings && ratings.length">
                    <li class="rating-item border-1px" v-for="(rating, index) in ratings" :key="index" v-show="needShow(rating.rateType, rating.text)">
                        <div class="avatar">
                            <img :src="rating.avatar" alt="用户头像">
                        </div>
                        <div class="info">
                            <div class="user clearfix">
                                <div class="name">{{rating.username}}</div>
                                <div class="rating-time">{{rating.rateTime | formatDate}}</div>
                            </div>
                            <div class="score">
                                <star :size="36" :score="rating.score"></star>
                                <div v-show="rating.deliveryTime" class="delivery-time">{{rating.deliveryTime}}分钟送达</div>
                            </div>
                            <div class="text">{{rating.text}}</div>
                            <div class="recommend">
                                <i class="icon" :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
                                <span v-for="(recommend, index) in rating.recommend" :key="index" class="item">{{recommend}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { getRatings } from 'api'
import star from 'components/star/star'
import split from 'components/split/split'
import BScroll from 'better-scroll'
import ratingSelected from 'components/ratingselected/ratingselected'
import {formatDate} from 'common/js/date'

const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
    props: {
        seller: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            ratings:[],
            selectType: ALL,
            onlyContent: false,
        }
    },
    components: {
        star,
        split,
        ratingSelected
    },
    methods: {
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
    },
    filters: {
        formatDate(time) {
            let date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
    },
    created() {
        getRatings().then((ratings) => {
            this.ratings = ratings
            this.$nextTick(() => {
                this.scroll = new BScroll(this.$refs.ratings, {
                    click: true
                })
            })
        })
    }
}
</script>

<style lang="scss" scope>
@import "~common/sass/mixin.scss";
@import "~common/sass/common.scss";

    .ratings {
        position: absolute;
        top: 175px;
        left: 0;
        width: 100%;
        height: calc(100% - 175px);
        overflow: hidden;
        .overview-wrapper {
            display: flex;
            padding: 18px 0;
            .overview-left {
                flex: 0 0 137px;
                width: 137px;
                text-align: center;
                @include border-1px(rgb(7,17,27,0.1));
                .score {
                    color: rgb(255, 153, 0);
                    font-size: 24px;
                    line-height: 24px;
                }
                .grade {
                    padding-top: 6px;
                    color: rgb(7,17,27);
                    font-size: 12px;
                    line-height: 18px;
                }
                .percent {
                    padding: 8px 0 6px 0;
                    color: rgb(147, 153, 159);
                    font-size: 10px;
                    line-height: 10px;
                }
            }
            .overview-right {
                flex: 1;
                padding: 0 24px;
                border-left: 1px solid rgba(7,17,27,0.1);
                .score {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    font-size: 0;
                    padding-bottom: 8px;
                    .text {
                        display: block;
                        padding-left: 6px;
                        font-size: 12px;
                        color: rgb(255, 153, 0);
                        line-height: 18px;
                    }
                    &:last-child {
                        padding-bottom: 0;
                    }
                    .title {
                        display: block;
                        font-size: 14px;
                        color: rgb(7,17,27);
                        padding-right: 6px;
                    }

                }
                .delivery-time {
                    line-height: 18px;
                    .time {
                        font-size: 12px;
                        color: rgb(147,153,159);

                    }
                }
            }
        }
        .rating-list {
            padding: 18px;
            .rating-item {
                display: flex;
                padding-bottom: 16px;
                border-bottom: 1px solid rgb(7, 17, 27, 0.1);
                &:not(:first-child) {
                    margin: 16px 0 0 0;
                }
                .avatar {
                    margin-right: 12px;
                    flex: 0 0 12px;
                    img {
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                    }
                }
                .info {
                    flex: 1;
                    .user {
                        width: 100%;
                        font-size: 10px;
                        line-height: 12px;
                        padding-bottom: 4px;
                        .name {
                            float: left;
                            color: rgb(7,17,27);
                        }
                        .rating-time {
                            float: right;
                            font-weight: 200;
                            color: rgba(149, 153, 159);
                        }   
                    }
                    .score {
                        display: flex;
                        align-items: center;
                        padding-bottom: 6px;
                        .delivery-time {
                            padding-left: 6px;
                            font-size: 10px;
                            font-weight: 200;
                            color: rgb(149, 153, 159);
                            line-height: 12px;
                        }
                    }
                    .text {
                        font-size: 12px;
                        font-weight: 700;
                        line-height: 18px;
                        color: rgb(7, 17, 27);
                        margin-bottom: 8px;
                    }
                    .recommend {
                        .icon {
                            font-size: 12px;
                            line-height: 16px;
                            padding-right: 8px;
                            &.icon-thumb_up {
                                color: rgb(0, 160, 220);
                            }
                            &.icon-thumb_down {
                                color: rgb(183, 187, 191);
                            }
                        }
                        .item {
                            display: inline-block;
                            padding: 3px 6px;
                            color: rgba(149, 153, 159);
                            border: 1px solid rgba(7, 17, 27, 0.1);
                            border-radius: 2px;
                            margin-right: 8px;
                            font-size: 10px;
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
    } 
</style>
