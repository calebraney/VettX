import { attr, ClassWatcher } from '../utilities';
export const tabsAutoplay = function () {
  /*
  set the timer line to only have full opacity when inside the active class using CSS
  .w--current .tab_line {opacity: 1;}
  */
  //animation ID
  const ANIMATION_ID = 'autotabs';
  //selectors
  const TAB_MENU = '[data-ix-autotabs="menu"]';
  const TAB = '[data-ix-autotabs="link"]';
  const TIMER_LINE = '[data-ix-autotabs="line"]';
  const ACTIVE_CLASS = 'w--current';
  const DURATION = 'data-ix-autotabs-duration';
  //animation options
  const DEFAULT_DURATION = 5;

  const components = [...document.querySelectorAll(TAB_MENU)];
  components.forEach((component) => {
    const tabs = [...component.querySelectorAll(TAB)];
    const timerLines = [...component.querySelectorAll(TIMER_LINE)];
    //get component duration from attribute or set it to the default
    const timerDuration = attr(DEFAULT_DURATION, component.getAttribute(DURATION));
    if (tabs.length === 0) return;

    //set timer and gsap timeline variable
    let timer;
    let userClick = true; //track if the user clicked the tabr
    let tl = gsap.timeline({}); //create a gsap timeline
    clearInterval(timer); // clear the interval of the timer

    //timer
    const startTimer = function (tl) {
      //if timeline is currently running kill it
      if (tl) {
        tl.kill();
        tl = gsap.timeline({});
      }
      // timer is one less than duration to account for first interval
      let time = timerDuration - 1;
      // start gsap animation
      tl.fromTo(
        timerLines,
        {
          width: '0%',
        },
        {
          width: '100%',
          duration: time,
          ease: 'none',
        }
      );
      //create interval timer
      timer = setInterval(function () {
        //decrease the time by one second
        time--;
        //if timer is complete change tabs
        if (time === 0) {
          changeTab();
        }
      }, 1000);
    };

    const changeTab = function (nextIndex = undefined, manualClick = false) {
      //if tab wasn't manually clicked
      if (manualClick === false) {
        //set user click to false
        userClick = false;
        if (nextIndex === undefined) {
          nextIndex = findNextIndex();
        }
        const nextTab = tabs[nextIndex];
        nextTab.click();
      }
      //reset user click
      userClick = true;
      //clear the timer interval
      clearInterval(timer);
      //start the timer
      startTimer(tl);
    };
    changeTab(0);

    //utility function to find the next tab in the loop
    const findNextIndex = function () {
      let currentIndex;
      tabs.forEach((tab, index) => {
        if (tab.classList.contains(ACTIVE_CLASS)) {
          currentIndex = index;
        }
      });
      //if current item is the last item set active index to the first item
      if (currentIndex === tabs.length - 1) {
        return 0;
      } else {
        //otherwize set active index to the next item
        return currentIndex + 1;
      }
    };

    //event listener for if the user manually clicks a tab
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', function () {
        if (userClick === true) {
          changeTab(index, true);
        }
      });
    });
  });
};
