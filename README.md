Scrollspy and smoothscroll plugins combined. I've made this mainly to understand how jQuery plugins work.


#### Usage
	$(window).on('load', function() {
		$('nav').smartScroll({
			offset: 0,				// Scroll offset (e.g. you have a fixed header)
	
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

	smartscroll.ids			// List of all resolvable ids
	smartscroll.current		// Currently active id
	smartscroll.previous	// Previously active id
	
Each time you add or remove elements from the DOM, you will have to call the refresh method:

	$('nav').smartScroll('refresh');