Scrollspy and smoothscroll plugins combined. Based on Bootstrap [ScrollSpy](http://twitter.github.io/bootstrap/javascript.html#scrollspy). I've made this mainly to understand how jQuery plugins work.


#### Usage

	$('nav').smartScroll({
		offset: 0,			// Window offset

		class: 'active',	// CSS class that gets applied to currently active elements
		parent: '',			// If you want the active class to be applies to a parent element rather that the anchor tag itsert, insert a selector here. For example: 'li'

		speed: 'relative',	// Smooth scroll speed. Can be set to 'relative', so that speed gets calculated based on distance between window offset and target element position
		easing: 'swing',	// Smooth scroll easing

		activate: function( smartscroll ) {},	// Fires when an item gets activated
		scrollStart: function( smartscroll ) {},	// Fires when smooth scroll starts. Note: smartscroll.current here refers to the clicked element
		scrollEnd: function( smartscroll ) {}	// Fires when smooth scroll ends
	})
	
##### Properties

	smartscroll				// The menu element
	smartscroll.anchors		// List of all element's ids
	smartscroll.current		// Currently active element
	smartscroll.previous	// Previously active element
	
Each time you add or remove elements from the DOM, you will have to call the refresh method:

	$('nav').smartScroll('refresh')
	
##### Changelog

__v1.0.3__

- 'refresh' element positions on window resize

__v1.0.2__

- 'relative' property to 'speed' option. Scroll speed gets calculated based on distance between window offset and target element position
- 'scrollStart' and 'scrollEnd' callacks

__v1.0.1__

- 'speed', 'easing' options and 'activate' callback
	
__v1.0.0__

- Initial release
