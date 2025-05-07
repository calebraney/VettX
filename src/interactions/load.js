import { attr, checkBreakpoints, runSplit } from '../utilities';
/* CSS in PAGE Head

html:not(.w-editor) [data-ix-load]:not([data-ix-load="stagger"], [data-ix-load-run="false"]) {
	opacity: 0;
}
 html:not(.w-editor) [data-ix-load="stagger"]:not([data-ix-load-run="false"]) > * {
	opacity: 0;
}
*/

export const load = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = 'load';
  // hero animation attribute
  const ATTRIBUTE = 'data-ix-load';
  // hero animation selectors
  const HEADING = 'heading';
  const ITEM = 'item';
  const IMAGE = 'image';
  const LINE = 'line';
  const STAGGER = 'stagger';
  //tween options
  const POSITION = 'data-ix-load-position'; // sequential by default, use "<" to start tweens together
  const DEFAULT_STAGGER = '<0.2';

  //get itema
  const items = gsap.utils.toArray(`[${ATTRIBUTE}]`);
  if (items.length === 0) return;

  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: 'power1.out',
      duration: 0.8,
    },
  });
  //anything that needs to be set to start the interaction happens here

  //h1 load tween
  const loadHeading = function (item) {
    //reset items opacity
    item.style.opacity = '1';
    //check if item is rich text and if it is find the first child and set it to be the heading
    if (item.classList.contains('w-richtext')) {
      item = item.firstChild;
    }
    //get text positions
    const position = attr('<', item.getAttribute(POSITION));
    // split text and animate it
    SplitText.create(item, {
      type: 'lines',
      autoSplit: false,
      onSplit: (self) => {
        return tl.from(
          self.lines,
          {
            y: '2rem',
            opacity: 0,
            stagger: 0.1,
            onComplete: () => {
              self.revert;
            },
          },
          position
        );
      },
    });
  };
  //images load tween
  const loadImage = function (item) {
    // get the position attribute or set defautl position
    const position = attr(DEFAULT_STAGGER, item.getAttribute(POSITION));
    tl.fromTo(item, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1 }, position);
  };
  //images load tween
  const loadLine = function (item) {
    // get the position attribute or set defautl position
    const position = attr(DEFAULT_STAGGER, item.getAttribute(POSITION));
    tl.fromTo(
      item,
      { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
      position
    );
  };
  //default load tween
  const loadItem = function (item) {
    // get the position attribute
    const position = attr(DEFAULT_STAGGER, item.getAttribute(POSITION));
    tl.fromTo(item, { opacity: 0, y: '2rem' }, { opacity: 1, y: '0rem' }, position);
  };

  //add item tween to each element in this parent
  const loadStagger = function (item) {
    if (!item) return;
    //set opacity to 1
    // get the children of the item
    const children = gsap.utils.toArray(item.children);
    if (children.length === 0) return;
    children.forEach((child, index) => {
      //first item set parent opacity to 1
      if (index === 0) {
        item.style.opacity = 1;
      }
      loadItem(child);
    });
  };

  const loadSimple = function (item) {
    if (!item) return;
    tl.fromTo(
      item,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: 'power1.out',
        duration: 1.2,
      },
      '<'
    );
  };

  //get all elements and apply animations

  items.forEach((item) => {
    if (!item) return;
    //find the type of the load animation
    const loadType = item.getAttribute(ATTRIBUTE);
    //check breakpoints and exit if set to false
    let runOnBreakpoint = checkBreakpoints(item, ANIMATION_ID, gsapContext);
    if (runOnBreakpoint === false && item.getAttribute('data-ix-load-run') === 'false') return;

    //create variables from GSAP context
    let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;
    //if reduce motion is true or run animation is false but the run attribute is true use a simple fade in
    if (
      reduceMotion ||
      (runOnBreakpoint === false && item.getAttribute('data-ix-load-run') === 'true')
    ) {
      //simple animation
      if (loadType === STAGGER) {
        loadSimple(item.children);
      } else {
        loadSimple(item);
      }
    } else {
      //otherwise assign the correct animation to each element type
      if (loadType === HEADING) {
        loadHeading(item);
      }
      if (loadType === IMAGE) {
        loadImage(item);
      }
      if (loadType === LINE) {
        loadLine(item);
      }
      if (loadType === ITEM) {
        loadItem(item);
      }
      if (loadType === STAGGER) {
        loadStagger(item);
      }
    }
  });

  //Play interaction on font load, or remove it from callback to play immediately
  document.fonts.ready.then(() => {
    tl.play(0);
  });
  // Alternatively use the returned tl to trigger the interaction after transition or image load
  return tl;
};
