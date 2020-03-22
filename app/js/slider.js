function Slider({
  slider,
  screen,
  slideClass,
  autoplay = false,
  playInterval,
  controlClass = false
}) {
  let start,
    diff = 0,
    isInTransit = false,
    allSlides,
    slideRect,
    direction,
    offset = 0,
    timerId,
    controlActiveClass,
    controls,
    currentIndex = 0,
    isTouchable = false;

  let events = {
    mousedown: 'mousedown',
    mousemove: 'mousemove',
    click: 'click',
    mouseup: 'mouseup'
  }
  //Move slider on a given distance
  function moveSlider(diff) {
    //Switch off transition property
    screen.style.transition = 'none';

    let x = -((currentIndex + offset) * 100) + '%';

    screen.style.transform = `translateX(calc(${x} + ${diff}px)`;
  }

  function getNewIndex(direction) {
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
      newIndex = allSlides.length - 1;
    } else if (newIndex > allSlides.length - 1) {
      newIndex = 0;
    }

    return newIndex;
  }
  //Take back slide to the old position
  function clearMove() {
    isInTransit = true;
    //Switch on transition property
    screen.style.transition = '';

    let x = -((currentIndex + offset) * 100) + '%';

    screen.style.transform = `translateX(${x})`;

    start = 0;
    diff = 0;
  }
  //If escape event fired, return a slide or show a new one
  function handleMove() {
    if (!start || !diff) return;

    if (Math.abs(diff) < slideRect.width / 4) {
      clearMove();
      return;
    }

    let newIndex = getNewIndex(direction);
    showNextSlide(newIndex);
  }
  //Find value for transform property and show a new slide 
  function showNextSlide(index) {
    isInTransit = true;
    //Switch on transition property
    screen.style.transition = '';

    let x;

    if (index == allSlides.length - 1 && offset == 1) {
      x = 0;
    } else if (index == 0 && offset == -1) {
      x = -(allSlides.length - 1) * 100 + "%";
    } else {
      x = -(index * 100) + '%';
    }

    screen.style.transform = `translateX(${x})`;

    start = 0;
    diff = 0;

    if (controlClass) highlightControl(index);

    currentIndex = index;
  }
  //Add last slide to the start and set an offset to show it correctly
  function addLastToStart() {
    allSlides[allSlides.length - 1].style.order = '-1';
    allSlides[0].style.order = '';
    offset = 1;
  }
  //Add first slide to the end
  function addFirstToEnd() {
    allSlides[0].style.order = '1';
    allSlides[allSlides.length - 1].style.order = '';
    offset = -1;
  }
  //To change slides in case of autoplay
  function autoChange() {
    timerId = setTimeout(() => {
      direction = 1;
      let index = getNewIndex(direction);
      //If it's the right edge, show the first slide and do all stuff from the start
      if (index == 0) {
        addFirstToEnd();
        moveSlider(0);
      }

      setTimeout(showNextSlide, 0, index);
    }, playInterval)
  }

  function highlightControl(index) {
    //If it's the first call, so there is no control to remove highlight state
    if (index != currentIndex) controls[currentIndex].classList.remove(controlActiveClass);

    controls[index].classList.add(controlActiveClass);
  }

  this.init = function() {
    allSlides = document.getElementsByClassName(slideClass);
    //Just one slide = no need to kick of all stuff
    if (!allSlides[1]) return;
    //Get the coords of the slide container
    slideRect = slider.getBoundingClientRect();
    //Check on touchscreen and change events
    if ('ontouchstart' in window) {
      events = {
        mousedown: 'touchstart',
        mousemove: 'touchmove',
        click: 'touchend',
        mouseup: 'touchend'
      }

      isTouchable = true;
    }
    //If controls is on
    if (controlClass) {
      let controlContainer = document.createElement('ul');
      controlContainer.classList.add(controlClass);
      controlActiveClass = controlClass + "__item_highlighted";
      //One control for each slide
      controls = Array.prototype.map.call(allSlides, () => document.createElement('li'));

      controlContainer.append(...controls);

      slider.append(controlContainer);
      //Highlight current control on init
      highlightControl(currentIndex);
      //Change slides on click
      controlContainer.addEventListener(events.click, function(e) {
        if (isInTransit) return;

        let target = e.target;
        if (!target.closest('li') || target == controls[currentIndex]) return;
        //If changing slide is scheduled, then cancel it
        if (timerId) clearTimeout(timerId);
        //Find index and show corresponding slide
        let index = controls.indexOf(target);
        showNextSlide(index);
      })
    }
    //Find and remember start position of event so as to calculate trace on mousemove or touchmove event later on
    slider.addEventListener(events.mousedown, function(e) {
      //Disable text selection when moving slide with mouse control
      if (!isTouchable) e.preventDefault();

      if (isInTransit) return;

      start = isTouchable ? e.touches[0].clientX : e.clientX;
    });

    slider.addEventListener(events.mousemove, function(e) {
      if (!start || isInTransit) return;

      let clientX = isTouchable ? e.touches[0].clientX : e.clientX;

      diff = clientX - start;

      if (diff == 0) return;

      if (timerId) clearTimeout(timerId);

      direction = diff < 0 ? 1 : -1;
      //If it's the first slide and right swipe detected, so add the last slide to the start
      if (direction == -1 && currentIndex == 0) addLastToStart();
      //If it's the last slide and left swipe detected, so add the first slide
      if (direction == 1 && currentIndex == allSlides.length - 1) addFirstToEnd();
      //Move slide with mousepointer
      moveSlider(diff);

      //Emulate mouseout behaviour
      if (isTouchable) {
        let clientY = e.touches[0].clientY;

        if (clientX < slideRect.x ||
          clientX > slideRect.right ||
          clientY < slideRect.y ||
          clientY > slideRect.bottom) handleMove();
      }
    });

    screen.addEventListener('transitionend', function(e) {
      isInTransit = false;
      //If autoplay is true, schedule to change slide
      if (autoplay) {
        timerId = setTimeout(() => {
          direction = 1;
          let index = getNewIndex(direction);

          if (index == 0) {
            addFirstToEnd();
            moveSlider(0);
          }

          setTimeout(showNextSlide, 0, index);
        }, playInterval)
      };

      if (currentIndex < allSlides.length - 1 && currentIndex > 0) return;
      //If order property of last or first slide was changed, so take it back 
      let x = -currentIndex * 100 + '%';

      allSlides[allSlides.length - 1].style.order = '';
      allSlides[0].style.order = '';
      screen.style.transition = 'none';
      screen.style.transform = `translate(${x})`;

      offset = 0;
    });
    //Change slide with mouse control or touchmove
    slider.addEventListener(events.mouseup, handleMove);
    slider.addEventListener('mouseout', handleMove);
    //Kickoff first slide in case of autoplay
    if (autoplay) {
      timerId = setTimeout(showNextSlide, playInterval, 1);
    }

    window.addEventListener('resize', function() {
      if (timerId) clearTimeout(timerId);

      slideRect = slider.getBoundingClientRect();
    })
  }
}

export { Slider as default };