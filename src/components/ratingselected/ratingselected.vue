<template>
    <div class="ratingSelected">
        <div class="rating-type border-1px">
            <span @click="select(2, $event)" class="positive" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">{{this.ratings.length}}</span></span>
            <span @click="select(0, $event)" class="positive" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">{{this.positive.length}}</span></span>
            <span @click="select(1, $event)" class="negative" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">{{this.negative.length}}</span></span>
        </div>
        <div @click="toggleContent" class="switch" :class="{'on': this.onlyContent}">
            <i class="icon-check_circle"></i>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
    props: {
        ratings: {
            type: Array,
            default() {
                return []
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: false
        },
        desc: {
            type: Object,
            default() {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }
        }
    },
    computed: {
        positive() {
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE
            })
        },
        negative() {
            return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE
            })
        }
    },
    methods: {
        select(type) {
            this.$emit('rating_select', type)
        },
        toggleContent() {
            this.$emit('content_rating')
        }
    }
}
</script>

<style lang="scss">
@import "~common/sass/mixin.scss";
@import "~common/sass/common.scss";
    .ratingSelected {
        .rating-type {
            padding: 18px 0;
            margin: 0 18px;
            @include border-1px(rgba(7,17,27,0.1));
            font-size: 0;
            span {
                display: inline-block;
                padding: 4px 6px;
                color: rgb(77, 85, 93);
                margin-right: 8px;
                font-size: 12px;
                line-height: 16px;
                border-radius: 2px;
                &:last-child {
                    margin-right: 0;
                }
                .count {
                    margin-left: 1px;
                    font-size: 8px;
                }
            }
            .active {
                color: #fff;
                .count {
                    color: #fff;
                }
            }
            .positive {
                background: #ccecf8;
                &.active {
                    background: #00a0dc;
                }
            }
            .negative {
                background: #e9ebec;
                &.active {
                    background: rgb(77, 85, 93);
                }
            }
        }
        .switch {
            padding: 12px 18px;
            color: rgb(147, 153, 159);
            line-height: 24px;
            border-bottom: 1px solid rgb(7, 17, 27, 0.1);
            font-size: 0;
            &.on {
                .icon-check_circle {
                    color: #00c850;
                }
            }
            .icon-check_circle {
                display: inline-block;
                vertical-align: top;
                font-size: 24px;
                margin-right: 4px;
            }
            .text {
                display: inline-block;
                vertical-align: top;
                font-size: 12px;
            }
        }
    }
</style>
