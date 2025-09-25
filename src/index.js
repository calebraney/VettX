import { attr } from './utilities';
import { accordion } from './interactions/accordion';
import { tabsAutoplay } from './interactions/autoplay-tabs';
import { countUp } from './interactions/count-up';
import { initLenis } from './interactions/lenis';
import { load } from './interactions/load';
import { marquee } from './interactions/marquee';
import { mouseOver } from './interactions/mouse-over';
import { scrollIn } from './interactions/scroll-in';
import { videoPlyr } from './interactions/video-plyr';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  // console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }

  //////////////////////////////
  //Global Variables

  const contactCalendar = function () {
    const WRAP = '[data-ix-cal="wrap"]';
    const DATE = '[data-ix-cal="date"]';
    const DAY = '[data-ix-cal="day"]';
    const MONTH = '[data-ix-cal="month"]';

    //elements
    const wraps = [...document.querySelectorAll(WRAP)];
    if (wraps.length === 0) return;

    wraps.forEach((wrap) => {
      //get items
      const month = wrap.querySelector(MONTH);
      const dates = [...wrap.querySelectorAll(DATE)];
      const days = [...wrap.querySelectorAll(DAY)];
      //guard clause
      if (!month) return;

      //utility funciton to get the current day and format results
      function getDateInfo() {
        const today = new Date();

        // 2. Format current Month and Year
        const monthOutput = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });

        // Arrays to store results
        const datesOutput = [];
        const daysOutput = [];

        // Weekday names (3-letter format)
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // 3 & 4. Loop through today + next 4 days
        for (let i = 0; i < 5; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);

          // Day of the month
          datesOutput.push(date.getDate().toString());

          // Day of the week
          daysOutput.push(dayNames[date.getDay()]);
        }

        return { monthOutput, datesOutput, daysOutput };
      }

      // get object with results
      const result = getDateInfo();

      //set days and months in the UI
      month.textContent = result?.monthOutput;
      dates.forEach((item, i) => {
        item.textContent = result?.datesOutput[i];
      });
      days.forEach((item, i) => {
        item.textContent = result?.daysOutput[i];
      });
    });
  };

  //////////////////////////////
  //Control Functions on page load
  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;
        //functional interactions
        lenis = initLenis();
        accordion(gsapContext);
        countUp(gsapContext);
        marquee(gsapContext);
        load(gsapContext);
        tabsAutoplay(gsapContext);
        contactCalendar(gsapContext);
        //conditional interactions
        if (!reduceMotion) {
          scrollIn(gsapContext);
          mouseOver(gsapContext);
        }
        //setup video players
        const [players, components] = [videoPlyr()];
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  const scrollReset = function () {
    //selector
    const RESET_EL = '[data-ix-reset]';
    //time option
    const RESET_TIME = 'data-ix-reset-time';
    const resetScrollTriggers = document.querySelectorAll(RESET_EL);
    resetScrollTriggers.forEach(function (item) {
      item.addEventListener('click', function (e) {
        //reset scrolltrigger
        ScrollTrigger.refresh();
        //if item has reset timer reset scrolltriggers after timer as well.
        if (item.hasAttribute(RESET_TIME)) {
          let time = attr(1000, item.getAttribute(RESET_TIME));
          //get potential timer reset
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, time);
        }
      });
    });
  };
  scrollReset();

  const updaterFooterYear = function () {
    // set the fs-hacks selector
    const YEAR_SELECTOR = '[data-footer-year]';
    // get the the span element
    const yearSpan = document.querySelector(YEAR_SELECTOR);
    if (!yearSpan) return;
    // get the current year
    const currentYear = new Date().getFullYear();
    // set the year span element's text to the current year
    yearSpan.innerText = currentYear.toString();
  };
  updaterFooterYear();
});
