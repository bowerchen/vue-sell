<template>
    <div class="cartControl">
        <transition name="move">
            <div class="cart-descrease" v-show="food.count > 0" @click.stop.prevent="descreaseCart">
                <i class="icon-remove_circle_outline inner"></i>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
        <div class="cart-add" @click.stop.prevent="addCart">
            <i class="icon-add_circle"></i>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    props: {
        food: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    methods: {
        addCart(e) {
            if (!e._constructed) {
                return
            }
            if (!this.food.count) {
                Vue.set(this.food,'count', 1)
            } else {
                this.food.count += 1;
            }
            this.$emit('cart_add', e.target);
        },
        descreaseCart() {
            this.food.count--;
        }
    }
}
</script>

<style lang="scss">
    .cartControl {
        div {
            display: inline-block;
            vertical-align: top;
        }
        .cart-descrease,
        .cart-add {
            display: inline-block;
            font-size: 24px;
            line-height: 24px;
            color: rgb(0,160,220);
            padding: 6px;
        }
        .cart-count {
            display: inline-block;
            vertical-align: top;
            width: 12px;
            padding-top: 6px;
            line-height: 24px;
            text-align: center;
            font-size: 10px;
            line-height: 24px;
            color: rgb(147,153,159);
        }
        .cart-descrease {
            transform: translate3d(0, 0, 0);
            opacity: 1;
            .inner {
                display: inline-block;
                line-height: 24px;
                font-size: 24px;
                color: rgb(0, 160, 220);
                transition: all 0.4s linear;
                transform: rotate(0);
            }
            &.move-enter-active,
            &.move-leave-active {
                transition: all .4s linear;
            }
            &.move-enter,
            &.move-leave-active {
                opacity: 0;
                transform: translate3d(24px, 0, 0);
                .inner {
                    transform: rotate(180deg);
                }
            }
        }

        
    }
</style>
