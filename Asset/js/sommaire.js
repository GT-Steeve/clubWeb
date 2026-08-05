    (function () {
      var cards = document.querySelectorAll('.course-card');
      var webCourses = [], jvCourses = [];

      cards.forEach(function (card) {
        var webEl   = card.querySelector('.card-num-web');
        var jvEl    = card.querySelector('.card-num-jv');
        var titleEl = card.querySelector('.card-title');
        var href    = card.getAttribute('href');
        var title   = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';

        var wn = webEl && webEl.textContent.trim() ? parseInt(webEl.textContent, 10) : NaN;
        var jn = jvEl  && jvEl.textContent.trim()  ? parseInt(jvEl.textContent,  10) : NaN;
        if (!isNaN(wn)) webCourses.push({ num: wn, title: title, href: href });
        if (!isNaN(jn)) jvCourses.push({ num: jn, title: title, href: href });
      });

      webCourses.sort(function (a, b) { return a.num - b.num; });
      jvCourses.sort(function (a, b)  { return a.num - b.num; });

      function buildList(listId, countId, courses) {
        var list    = document.getElementById(listId);
        var countEl = document.getElementById(countId);
        if (!list) return;
        if (countEl) countEl.textContent = courses.length;
        courses.forEach(function (c) {
          var li = document.createElement('li');
          li.innerHTML =
            '<a href="' + c.href + '">' +
              '<span class="aside-num">' + String(c.num).padStart(2, '0') + '</span>' +
              '<span class="aside-title">' + c.title + '</span>' +
            '</a>';
          list.appendChild(li);
        });
      }

      buildList('webList', 'webCount', webCourses);
      buildList('jvList',  'jvCount',  jvCourses);
    })();
