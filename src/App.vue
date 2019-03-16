<template>
  <div id="app">
    <VHeader :seller="seller"></VHeader>
    <div class="tab">
        <div class="tab-item">
            <router-link to="/goods">商品</router-link>
        </div>
        <div class="tab-item">
            <router-link to="/ratings">评论</router-link>
        </div>
        <div class="tab-item">
            <router-link to="/seller">商家</router-link>
        </div>
    </div>
    <router-view :seller="seller" class="content"></router-view>
  </div>
</template>

<script>
import { getSeller } from 'api'
import VHeader from 'components/v-header/v-header'

export default {
  name: 'app',
  data() {
    return {
      seller: {}
    }
  },
  created() {
    getSeller().then((seller) => {
      this.seller = seller
    })
  },
  components: {
    VHeader
  }
}
</script>

<style lang="scss">
@import '~normalize.css';
@import '~common/sass/icon.css';
@import '~common/sass/mixin.scss';
@import '~common/sass/variable.scss';

.tab {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  @include border-1px(rgba(7,17,27,0.1));
  .tab-item {
    flex: 1;
    display: inline-block;
    font-size: 14px;
    text-align: center;
    a {
      text-decoration: none;
      color: $black;
      &:hover {
        color: $red;
      }
    }
  }
}
</style>
