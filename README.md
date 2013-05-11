##smartScroll


Scrollspy and smoothscroll plugins combined. Based on Bootstrap [ScrollSpy](http://twitter.github.io/bootstrap/javascript.html#scrollspy). I've made this mainly to understand how jQuery plugins work.


####Usage 

	$('ul.menu').smartScroll({
		class: 'active',
		offset: 0,
		selector: 'a',
		
		activate: function () {}
	})
	
Each time you add or remove elements from the DOM, you will have to call the refresh method:

	$('ul.menu').smartScroll('refresh')
