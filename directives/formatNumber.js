/* eslint-disable no-debugger, no-console */

import Vue from 'vue';
const vuex = require('../../store');
export const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
export const fullMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
export const shortDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const fullDay = [
  'Monday',
  'Tuesday',
  'Wednesdat',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
export const validNumberKeyCodes = [
  96,
  97,
  98,
  99,
  100,
  101,
  102,
  103,
  104,
  105,
  109,
  110,
  188,
  189,
  190,
  46,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  8,
  9,
  13,
  37,
  38,
  39,
  40
];
export const validNumberIntKeyCodes = [
  96,
  97,
  98,
  99,
  100,
  101,
  102,
  103,
  104,
  105,
  109,
  110,
  188,
  46,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  8,
  9,
  13,
  37,
  38,
  39,
  40
];
export const validNumberFloatKeyCodes = [
  96,
  97,
  98,
  99,
  100,
  101,
  102,
  103,
  104,
  105,
  109,
  110,
  188,
  190,
  46,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  8,
  9,
  13,
  37,
  38,
  39,
  40
];
export const prefixDate = ['st', 'nd', 'rd', 'th'];
// export const fixedRole = ['admin', 'staff'];

Vue.directive('currency', {
  // v-currency:inputType
  bind(el, binding) {
    // console.log(binding.modifiers);
    if (binding.arg === 'type') {
      console.log(binding.arg);
    } else if (binding.arg === 'inputType') {
      const val = el.value.trim();
      const hT = val.split('.');
      const head = hT[0].split('');
      if (head.length > 3) {
        let index = 3;
        while (head.length - index >= 1) {
          head.splice(head.length - index, 0, ',');
          index += 4;
        }
      }
      const render = () => {
        const val = el.value.replaceAll(',', '');
        const hT = val.split('.');
        const head = hT[0].split('');
        if (head.length > 3) {
          let index = 3;
          while (head.length - index >= 1) {
            head.splice(head.length - index, 0, ',');
            index += 4;
          }
        }
        el.value = hT.length > 1 ? head.join('') + hT[1] : head.join('');
      };
      el.value = hT.length > 1 ? head.join('') + hT[1] : head.join('');
      el.addEventListener('keyup', (e) => {
        if (
          !validNumberKeyCodes.includes(e.keyCode) &&
          !(
            (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
            (e.ctrlKey === true || e.metaKey === true)
          )
        ) {
          e.preventDefault();
        } else {
          render();
        }
      });
      el.addEventListener('keydown', (e) => {
        if (
          !validNumberKeyCodes.includes(e.keyCode) &&
          !(
            (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
            (e.ctrlKey === true || e.metaKey === true)
          )
        ) {
          e.preventDefault();
        } else {
          render();
        }
      });
      el.addEventListener('keypress', (e) => {
        if (
          !validNumberKeyCodes.includes(e.keyCode) &&
          !(
            (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
            (e.ctrlKey === true || e.metaKey === true)
          )
        ) {
          e.preventDefault();
        } else {
          render();
        }
      });
      // el.addEventListener('keyup', (e) => {
      //   if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      //     render();
      //   } else {
      //     e.preventDefault();
      //   }
      // });
      // el.addEventListener('keydown', (e) => {
      //   if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      //     render();
      //   } else {
      //     e.preventDefault();
      //   }
      // });
      // el.addEventListener('keypress', (e) => {
      //   if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      //     render();
      //   } else {
      //     e.preventDefault();
      //   }
      // });
    } else {
      const val = el.textContent.trim();
      const hT = val.split('.');
      const head = hT[0].split('');
      if (head.length > 3) {
        let index = 3;
        while (head.length - index >= 1) {
          head.splice(head.length - index, 0, ',');
          index += 4;
        }
      }
      // console.log(hT);
      el.textContent =
        hT.length > 1 ? head.join('') + '.' + hT[1] : head.join('');
    }
  }
});

// number only
Vue.directive('number', {
  // v-nummber
  bind(el) {
    // console.log(binding.modifiers);
    el.addEventListener('keyup', (e) => {
      if (
        !validNumberKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
    el.addEventListener('keydown', (e) => {
      // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      // } else {
      //   e.preventDefault()
      // }
      if (
        !validNumberKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
    el.addEventListener('keypress', (e) => {
      // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      // } else {
      //   e.preventDefault()
      // }
      if (
        !validNumberKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
  }
});
Vue.directive('numberFloat', {
  // v-nummber
  bind(el) {
    // console.log(binding.modifiers);
    el.addEventListener('keyup', (e) => {
      if (
        !validNumberIntKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 ||
            e.keyCode === 86 ||
            e.keyCode === 67 ||
            e.keyCode === 190) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
    el.addEventListener('keydown', (e) => {
      // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      // } else {
      //   e.preventDefault()
      // }
      if (
        !validNumberIntKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 ||
            e.keyCode === 86 ||
            e.keyCode === 67 ||
            e.keyCode === 190) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
    el.addEventListener('keypress', (e) => {
      // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      // } else {
      //   e.preventDefault()
      // }
      if (
        !validNumberIntKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 ||
            e.keyCode === 86 ||
            e.keyCode === 67 ||
            e.keyCode === 190) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
  }
});
Vue.directive('numberInt', {
  // v-nummber
  bind(el) {
    // console.log(binding.modifiers);
    el.addEventListener('keyup', (e) => {
      if (
        !validNumberIntKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
    el.addEventListener('keydown', (e) => {
      // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      // } else {
      //   e.preventDefault()
      // }
      if (
        !validNumberIntKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
    el.addEventListener('keypress', (e) => {
      // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      // } else {
      //   e.preventDefault()
      // }
      if (
        !validNumberIntKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 67) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
    });
  }
}); // 4/3/2021 04/3/2021 => 04/03/2021 2100
Vue.directive('datetime', {
  // v-datetime="'hh:mm dd-mm-yyyy'"
  bind(el, binding) {
    const val = new Date(el.textContent.trim());
    const hh = ('0' + val.getHours()).slice(-2);
    const mm = ('0' + val.getMinutes()).slice(-2);
    // let s = ('0' + val.getSeconds()).slice(-2)
    // let dd = val.getDay()
    const d = ('0' + val.getDate()).slice(-2);
    const m = ('0' + (val.getMonth() + 1)).slice(-2);
    const y = val.getFullYear();
    let returnVal = '';
    // console.log(binding.expression)
    switch (binding.expression) {
      case "'hh:mm dd-mm-yyyy'":
        returnVal = `${hh}:${mm} ${d}-${m}-${y}`;
        break;
      case "'hh:mm dddd-mmmm-yyyy'":
        returnVal = `${hh}:${mm} Ngày ${d}, Tháng${m}, Năm${y}`;
        break;
      default:
        returnVal = val;
        break;
    }
    el.textContent = returnVal;
  }
});
// check role
Vue.directive('role', {
  // v-role
  bind(el, binding) {
    if (!binding.value || !binding.value.length) {
      const elS = el.getAttribute('style') + ' display :none !important';
      el.setAttribute('style', elS);
      el.remove();
      return;
    }
    let valid = false;
    const stateRole = vuex.state().userRole;
    stateRole.forEach((o) => {
      if (binding.value.includes(o)) {
        valid = true;
      }
    });
    if (!valid) {
      const elS = el.getAttribute('style')
        ? el.getAttribute('style') + ' display :none !important'
        : 'display :none !important';
      el.setAttribute('style', elS);
      el.remove();
    }
    // console.log(binding, 'binding');
    // console.log(el, 'el');
    // console.log(stateVuex);
  }
});

// CUSTOMIZE
Vue.directive('numberFloatV2', {
  // v-nummber
  bind(el) {
    // console.log(binding.modifiers);
    el.addEventListener('keyup', (e) => {
      if (
        !validNumberFloatKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 ||
            e.keyCode === 86 ||
            e.keyCode === 67 ||
            e.keyCode === 190) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
      if (e.keyCode === 190 && e.target.value.includes('.')) {
        e.preventDefault();
      }
    });
    el.addEventListener('keydown', (e) => {
      // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      // } else {
      //   e.preventDefault()
      // }
      if (
        !validNumberFloatKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 ||
            e.keyCode === 86 ||
            e.keyCode === 67 ||
            e.keyCode === 190) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
      if (e.keyCode === 190 && e.target.value.includes('.')) {
        e.preventDefault();
      }
    });
    el.addEventListener('keypress', (e) => {
      // if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
      // } else {
      //   e.preventDefault()
      // }
      if (
        !validNumberFloatKeyCodes.includes(e.keyCode) &&
        !(
          (e.keyCode === 65 ||
            e.keyCode === 86 ||
            e.keyCode === 67 ||
            e.keyCode === 190) &&
          (e.ctrlKey === true || e.metaKey === true)
        )
      ) {
        e.preventDefault();
      }
      if (e.keyCode === 190 && e.target.value.includes('.')) {
        e.preventDefault();
      }
    });
  }
});
