$(document).ready(function () {
  /*
    ON-SCROLL ANIMATIONS

    taken from the following article:
    http://www.oxygenna.com/tutorials/scroll-animations-using-waypoints-js-animate-css
    big up to the authors for nice and easy implemenation for on-scroll animations!
  */

  function onScrollInit (items, trigger) {
    items.each(function () {
      var osElement = $(this)
      var osAnimationClass = osElement.attr('data-os-animation')
      var osAnimationDelay = osElement.attr('data-os-animation-delay')
      var screenSize = $(window).width()

      if (Modernizr.touch) {
        // no delay on touch devices (assume it's mobile)
        osElement.css({
          '-webkit-animation-delay': 0,
          '-moz-animation-delay': 0,
          'animation-delay': 0
        })
      }
      if (screenSize < 768) {
        // no delay on smaller screens
        osElement.css({
          '-webkit-animation-delay': 0,
          '-moz-animation-delay': 0,
          'animation-delay': 0
        })
      } else {
        osElement.css({
          '-webkit-animation-delay': osAnimationDelay,
          '-moz-animation-delay': osAnimationDelay,
          'animation-delay': osAnimationDelay
        })
      }

      var osTrigger = (trigger) ? trigger : osElement

      osTrigger.waypoint(function () {
        osElement.addClass('animated').addClass(osAnimationClass)
      }, {
        triggerOnce: true,
        offset: '85%'
      })
    })
  }

  /*
    activate on-scroll animations
    animation are set up throught HTML data- attributes
  */
  onScrollInit($('.os-animation'))
})
