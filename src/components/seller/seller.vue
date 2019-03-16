<template>
    <div class="seller" ref="seller">
        <div class="content">
            <div class="seller-wrapper">
                <div class="seller-info">
                    <div class="name">{{seller.name}}</div>
                    <div class="score-wrapper">
                        <star :size="36" :score="seller.score"></star>
                        <div class="rating-count">({{seller.ratingCount}})</div>
                        <div class="sell-count">月售{{seller.sellCount}}</div>
                    </div>
                </div>
                <div class="service">
                    <div class="item">
                        <span class="text">起送价</span>
                        <div class="min-price">{{seller.minPrice}}<span class="small">元</span></div>
                    </div>
                    <div class="item">
                        <span class="text">配送费</span>
                        <div class="delivery-price">{{seller.deliveryPrice}}<span class="small">元</span></div>
                    </div>
                    <div class="item">
                        <span class="text">配送时间</span>
                        <div class="delivery-time">{{seller.deliveryTime}}<span class="small">分钟</span></div>
                    </div>
                </div>
                <div class="favorite" @click="toggleFavorite">
                    <i class="icon-favorite icon" :class="{'on': active}"></i>
                    <div class="text">
                        {{favoriteText}}
                    </div>
                </div>
            </div>
            <split></split>
            <div class="active-wrapper">
                <div class="notice">
                    <div class="title">公告与活动</div>
                    <div class="infos">{{seller.bulletin}}</div>
                </div>
                <ul class="support-list">
                    <li class="support-item" v-for="(support, index) in seller.supports" :key="index">
                        <supportIcon :size="4" :type="support.type"></supportIcon>
                        <span class="text">{{support.description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="seller-image" ref="sellerImage">
                <div class="title">商家实景</div>
                <div class="pic-wrapper" ref="pics">
                    <div class="pic-list" ref="picList">
                        <div class="pic-item" v-for="(pic, index) in seller.pics" :key="index">
                            <img :src="pic" alt="场景图">
                        </div>
                    </div>
                </div>
            </div>
            <split></split>
            <div class="seller-infos">
                <div class="title">商家信息</div>
                <ul class="info-list">
                    <li class="info-item" v-for="(info, index) in seller.infos" :key="index">
                        <span class="text">{{info}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from 'components/star/star'
import split from 'components/split/split'
import supportIcon from 'components/support-icon/support-icon'

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
            active: false
        }
    },
    computed: {
        favoriteText() {
            return this.active ? '已收藏' : '收藏'
        } 
    },
    components: {
        star,
        split,
        supportIcon,
    },
    watch: {
        'seller'() {
            this.$nextTick(() => {
                this._initScroll()
                this._picScroll()
            })
        }
    },
    mounted() {
        this.$nextTick(() => {
            this._initScroll()
            this._picScroll()
        }) 
    },
    methods: {
        _initScroll() {
            if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.seller, {
                    click: true
                })
            } else {
                this.scroll.refresh()
            }
        },
        _picScroll() {
            if (this.seller.pics) {
                let picWidth = 120
                let margin = 6
                let width = (picWidth + margin) * this.seller.pics.length - margin
                this.$refs.picList.style.width = width + 'px'
                this.$nextTick(() => {
                    if (!this.picScroll) {
                        this.picScroll = new BScroll(this.$refs.pics, {
                            scrollX: true,
                            eventPassthrough: 'vertical'
                        })
                    } else {
                        this.picScroll.refresh()
                    }
                })
            } 
        },
        toggleFavorite() {
            this.active = !this.active
        }
    }
}
</script>

<style lang="scss" scope>
@import "~common/sass/icon.css";
    .seller {
        position: absolute;
        top: 175px;
        left: 0;
        width: 100%;
        height: calc(100% - 175px - 48px);
        overflow: hidden;
        .seller-wrapper {
            position: relative;
            padding: 16px;
            .seller-info {
                padding-bottom: 18px;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                .name {
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 14px;
                    color: rgb(7, 17, 27);
                    margin-bottom: 8px; 
                }
                .score-wrapper {
                    display: flex;
                    justify-content: flex-start;
                    .rating-count, .sell-count {
                        font-size: 10px;
                        color: rgb(77, 85, 93);
                        line-height: 18px;
                    }
                    .rating-count {
                        margin-left: 8px;
                    }
                    .sell-count {
                        margin-left: 12px;
                    }
                }
            }
            .service {
                display: flex;
                padding: 18px 0 0 0;
                .item {
                    flex: 1 1 auto;
                    text-align: center;
                    border-right: 1px solid rgba(7, 17, 27, 0.1);
                    &:last-child {
                        border-right: 0;
                    }
                    .text {
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                        line-height: 10px;
                        padding-bottom: 4px;
                    }
                    .min-price, .delivery-price, .delivery-time {
                        font-size: 24px;
                        font-weight: 200;
                        color: rgb(7, 17, 27);
                        line-height: 24px;
                        .small {
                            font-size: 10px;
                        }
                    }
                }
            }
            .favorite {
                position: absolute;
                top: 18px;
                right: 5px;
                width: 50px;
                text-align: center;
                .icon {
                    font-size: 24px;
                    color: rgb(77, 85, 93);
                    line-height: 24px;
                    &.on {
                        color: rgb(240, 20, 20);
                    }
                }
                .text {
                    padding-top: 4px;
                    font-size: 10px;
                    color: rgb(77, 85, 93);
                    font-weight: 200;
                    line-height: 10px;

                }
            }
        }
        .active-wrapper {
            padding: 18px;
            .notice {
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                .title {
                    font-size: 14px; 
                    font-weight: 700;
                    color: rgb(7, 17, 27);
                    margin-bottom: 8px;
                }
                .infos {
                    padding-left: 12px;
                    line-height: 24px;
                    font-weight: 200;
                    font-size: 12px;
                    color: rgb(240, 20, 20);
                }
            }
            .support-list {
                margin-top: 16px;
                .support-item {
                    display: flex;
                    align-items: center;
                    padding: 16px 0;
                    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                    font-size: 0;
                    &:last-child {
                        padding-bottom: 0;
                        border-bottom: 0;
                    }
                    .support-ico{
                        &:first-child {
                            margin-left: 12px;
                        }
                    }
                    .text {
                        padding-left: 6px;
                        font-size: 12px;
                        font-weight: 200;
                        color: rgb(7, 17, 27);
                        line-height: 16px;
                    }
                }
            }
        }
        .seller-image {
            padding: 18px;
            .title {
                padding-bottom: 12px;
                font-size: 14px;
                font-weight: 700;
                line-height: 14px;
                color: rgb(7, 17, 27);
            }
            .pic-wrapper {
                width: 100%;
                overflow: hidden;
                .pic-list {
                    display: flex;
                    flex-flow: row nowrap;
                    .pic-item {
                        margin-right: 6px;
                        &:last-child {
                            margin-right: 0;
                        }
                        img {
                            width: 120px;
                            height: 90px;
                        }
                    }
                }
            }
        }
        .seller-infos {
            padding: 18px;
            .title {
                font-size: 14px; 
                font-weight: 700;
                color: rgb(7, 17, 27);
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            }
            .info-list {
                .info-item {
                    padding: 16px 0;
                    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                    &:last-child {
                        padding-bottom: 0;
                    }
                    .text {
                        padding-left: 12px;
                        font-size: 12px;
                        font-weight: 200;
                        line-height: 16px;
                        color: rgb(7, 17, 27);
                    } 
                }
            }
        }
    }
</style>