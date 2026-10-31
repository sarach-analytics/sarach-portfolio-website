/* Small page helpers: Work filters. */
(function () {
  'use strict';
  var btns = document.querySelectorAll('[data-filter]');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-filter');
      btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      document.querySelectorAll('#work-rows .row').forEach(function (r) {
        r.hidden = !(k === 'all' || r.getAttribute('data-kind') === k);
      });
    });
  });
})();
