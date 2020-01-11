// based on https://gist.github.com/paulirish/12fb951a8b893a454b32

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const on = function(name, fn) {
  this.addEventListener(name, fn);
};

Node.prototype.on = on;
window.on = on;

NodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line

const multiOn = function(name, fn) {
  this.forEach(elem => {
    elem.on(name, fn);
  });
};

NodeList.prototype.on = multiOn;
NodeList.prototype.addEventListener = multiOn;

export { $, $$ };
