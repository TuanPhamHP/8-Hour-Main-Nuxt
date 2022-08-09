import Vue from 'vue';
import routeMixins from './routeMixins';
import localeMixins from './localeMixins';
import objHandlerMixins from './objHandlerMixins';

if (!Vue.__utils__) {
  Vue.__utils__ = true;
  Vue.mixin({
    mixins: [routeMixins, localeMixins, objHandlerMixins] // utils.js codes
  });
}
