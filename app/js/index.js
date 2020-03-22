import Smoothscroll from 'smoothscroll-polyfill';
import Nav from './nav';
import ScrollThis from './scrollThis';
import Slider from './slider';

//Kickoff the polyfill
Smoothscroll.polyfill();

const menu = document.querySelector('.nav');

const nav = new Nav({
  // toggleBtn: document.querySelector('.menu-toggle'),
  toggleBtnClass: 'menu-toggle',
  actionClass: 'is-menu-visible',
  menu: menu,
  iSpreventDefaulted: true,
  breakPoint: 768
});

const scrollThis = new ScrollThis({
  menu: menu,
  linkClass: 'nav__link',
  linkActiveClass: 'nav__link_active'
})

const slider = new Slider({
  slider: document.querySelector('.slider'),
  screen: document.querySelector('.slider__page'),
  slideClass: 'slider__item',
  controlClass: 'slider__control',
  // autoplay: true,
  playInterval: 2000
})

window.addEventListener('load', function() {
  nav.init();
  scrollThis.init();
  slider.init();
});