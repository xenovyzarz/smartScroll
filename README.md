Scrollspy and smoothscroll plugins combined. I've made this mainly to understand how jQuery plugins work.


#### Usage
	$(window).on('load', function() {
		$('nav').smartScroll({
			offset: 0,				// Window offset
	
			activeClass: 'active',	// Active element class
			parent: '',				// Apply class to parent rather than the anchor tag, e.g. 'li'
	
			filter: '',				// Filter out unwanted elements
			hash: false,			// Change hash on scroll
			
			speed: 'relative',		// Smooth scroll speed. Can be set to 'relative' for speed based on distance between window offset and target
			easing: 'swing',		// Smooth scroll easing
	
			activate: function( smartscroll ) {},	// Fires when an item gets activated
			scrollStart: function() {},		// Fires when smooth scrolling starts
			scrollEnd: function() {}		// Fires when smooth scrolling ends
		});
	});
	
#### Properties

	smartscroll				// Parent menu
	smartscroll.ids			// List of all ids
	smartscroll.current		// Currently active anchor
	smartscroll.previous	// Previously active anchor
	
Each time you add or remove elements from the DOM, you will have to call the refresh method:

	$('nav').smartScroll('refresh');

#### Changelog

__v1.1.0__

- 'hash' option enables hash change on scroll using HTML5 History API

__v1.0.4__

- 'filter' option to filter elements on 'refresh'

__v1.0.3__

- 'refresh' on window resize

__v1.0.2__

- 'relative' property for 'speed' option. Scroll speed gets calculated based on distance between window offset and target element position
- 'scrollStart' and 'scrollEnd' callbacks

__v1.0.1__

- 'speed', 'easing' options and 'activate' callback
	
__v1.0.0__

- Initial release
