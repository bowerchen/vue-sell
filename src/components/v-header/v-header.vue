<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="thum">
                <img width="64" height="64" :src="seller.avatar" alt="商家头像">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand-ico"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    <span class="text">{{seller.description}}/{{seller.deliveryTime}}分钟</span>
                </div>
                <div v-if="seller.supports" class="supports">
                    <supportIcon :size=1 :type="seller.supports[0].type"></supportIcon>
                    <!-- <span class="support-ico"></span> -->
                    <span class="desc">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="supports-counts"  @click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper"  @click="showDetail">
            <span class="bulletin-ico"></span><span v-if="seller.bulletin" class="content">{{seller.bulletin}}</span><i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%" alt="背景图">
        </div>
        <transition name="fade">
            <div v-show="detailShow" class="detail" transition="fade">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul class="supports-list" v-if="seller.supports">
                            <li class="supports-item" v-for="(support, index) in seller.supports" :key="index">
                                <supportIcon :size="2" :type="seller.supports[index].type"></supportIcon>
                                <span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p>{{seller.bulletin}}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type>
import supportIcon from 'components/support-icon/support-icon'
import star from 'components/star/star'

export default {
    name: 'v-header',
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
          detailShow: false
      }  
    },
    methods: {
        showDetail() {
            this.detailShow = true
        },
        hideDetail() {
            this.detailShow = false;
        }
    },
    components: {
        supportIcon,
        star
    }
}
</script>

<style lang="scss">
@import '~common/sass/variable.scss';
@import '~common/sass/mixin.scss';


.header {
    position: relative;
    color: $white;
    overflow: hidden;
    background-color: nth($bg, 3);
    .content-wrapper {
        padding: 24px 12px 18px 24px;
        font-size: 0;
        position: relative;
        .thum {
            display: inline-block;
            img {
                width: 64px;
                height: 64px;
                border-radius: 4px;
            }
        }
        .content {
            display: inline-block;
            font-size: 16px;
            vertical-align: top;
            padding: 2px 8px;
            .title {
                .brand-ico {
                    display: inline-block;
                    width: 30px;
                    height: 18px;
                    @include bg-image('brand');
                    background: {
                        size: 30px 18px;
                        repeat: no-repeat;
                    }
                }
                .name {
                    vertical-align: top;
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 18px;
                    padding-left: 6px;
                }

            }
            .description {
                margin: 0 0 10px 0;
                .text {
                    line-height: 12px;
                    font-size: 12px;
                    font-weight: 200;
                }
            }
            .supports {
                display: flex;
                align-items: center;
                .support-ico {
                    padding-right: 4px;
                }
                .desc {
                    font-size: 10px;
                    line-height: 12px;
                    font-weight: 200;
                }
            }
        }
        .supports-counts {
            position: absolute;
            right: 12px;
            bottom: 18px;
            background: nth($bg, 1);
            border-radius: 14px;
            padding: 0 8px;
            height: 24px;
            line-height: 24px;
            .count {
                vertical-align: top;
                padding-right: 2px;
                font-size: 10px;
            }
            .icon-keyboard_arrow_right {
                line-height: 26px;
                font-size: 10px;
            }
        }
    }
    .bulletin-wrapper {
        position: relative;
        padding: 0 22px 0 12px;
        height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: nth($bg, 2);
        line-height: 28px;

        .bulletin-ico {
            display: inline-block;
            vertical-align: top;
            margin-top: 7px;
            width: 22px;
            height: 12px;
            @include bg-image('bulletin');
            background-size: 22px 12px;
            margin-right: 4px;
        }
        .content {
            vertical-align: top;
            font-size: 10px;
            font-weight: 200;
        }
        .icon-keyboard_arrow_right {
            position: absolute;
            top: 10px;
            right: 12px;;
            font-size: 10px;
            color: $white;
            padding-left: 4px;
        }
    }
    .background {
        position: absolute;
        left: 0;
        top:0;
        z-index: -10;
        width: 100%;
        overflow: hidden;
        filter: blur(10px);
    }
    .fade-enter-active, .fade-leave-active {
        opacity: 1;
        // transition: all 0.5s ease;
    }
    .fade-enter, .fade-leave {
        opacity: 0;
        // transition: all 0.5 ease;
    }
    .detail {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background: nth($bg, 4);
        z-index: 100;
        transition: all 0.5s ease;
        backdrop-filter: blur(10px);
        &.fade-enter-active,&.fade-leave-active {
            opacity: 1;
        }
        &.fade-enter,&.fade-leave {
            opacity: 0;
        }
        .detail-wrapper {
            min-height: 100%;
            width: 100%;
            .detail-main {
                margin-top: 64px;
                padding-bottom: 64px;
                .name {
                    text-align: center;
                    font-size: 16px;
                    line-height: 16px;
                    margin-bottom: 16px;
                }
                .star-wrapper {
                    margin: 16px 0 28px 0;
                }
                .title {
                    display: flex;
                    width: 80%;
                    margin: 0 auto;
                    align-items: center;
                    .line {
                        flex: 1;
                        border-bottom: 1px solid nth($border-color, 2);
                    }
                    .text {
                        padding: 0 12px;
                        font-weight: 700;
                        font-size: 14px;
                    }
                }
                .supports-list {
                    width: 80%;
                    margin: 24px auto 28px auto;
                    .supports-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                        padding: 0 12px;
                        list-style: none;
                        font-size: 0;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        .text {
                            margin-left: 6px;
                            font-size: 12px;
                            font-weight: 200;
                        }
                    }
                }
                .bulletin {
                    width: 80%;
                    margin: 0 auto;
                    p {
                        padding: 0 12px;
                        font-size: 12px;
                        line-height: 24px;
                        font-weight: 200;
                    }
                }
            }
        }
        .detail-close {
            position: relative;
            height: 32px;    
            width: 32px;
            color: $white;
            font-size: 32px;
            margin: -64px auto 0 auto;
            clear: both;
        }
    }
}
</style>
