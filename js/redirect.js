'use strict';
const target = document.querySelector('a[href]').getAttribute('href');
location.replace(target + location.search + location.hash);
