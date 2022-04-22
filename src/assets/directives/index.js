import Vue from 'vue';

Vue.directive('masked', {
  inserted: (el) => {
    el.addEventListener('keypress', (e) => {
      const key = e.keyCode || e.charCode;
      if (key === 8 || key === 46) {
        return;
      }
      setTimeout(() => {
        e.target.selectionStart = 10000;
        e.target.selectionEnd = 10000;
      }, 50);
    });
  },
});

export default {};
