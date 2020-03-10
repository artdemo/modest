import Smoothscroll from 'smoothscroll-polyfill';
import Nav from './nav';
import ScrollThis from './scrollThis';

//Kickoff the polyfill
Smoothscroll.polyfill();

const menu = document.querySelector('.nav');

const nav = new Nav({
  // toggleBtn: document.querySelector('.menu-toggle'),
  toggleBtnClass: 'menu-toggle',
  actionClass: 'is-menu-visible',
  menu: menu,
  preventDefault: true,
  breakPoint: 768
});

const scrollThis = new ScrollThis({
  menu: menu,
  linkClass: 'nav__link',
  linkActiveClass: 'nav__link_active'
})

window.addEventListener('load', function() {
  nav.init();
  scrollThis.init();
});