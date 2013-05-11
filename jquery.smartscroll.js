/*-----------------------------------------------------------------------------------
	smartScroll - v1.0.0 - 2013-05-11
	https://github.com/happytodesign/smartScroll

	© 2013 happytodesign.com
	Licensed WTFPL
-----------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------
	TODO:
		* (?) Allow for non-anchor elements
		* Handle elements with same offset
		* Relative scroll speed
-----------------------------------------------------------------------------------*/

! function ( $, window ) {

	var defaults = {
		class: 'active',
		offset: 0,
		selector: 'a',

		activate: function () {}
	}

	function smartScroll ( element, options ) {

		this.window = $( window )
		this.element = element
		this.options = $.extend( defaults, options )

		this.init()
	}

	smartScroll.prototype = {

		init: function () {

			var that = this

			this.window.on( 'scroll.smartScroll', $.proxy( this.monitor, this ) )

			this.window.on( 'mousedown.smartScroll mousewheel.smartScroll keyup.smartScroll', function ( e ) {
				if ( that.scrolling ) {
					that.scrolling = false
					$( 'body' ).stop()
				}
			})

			this.refresh()
			this.monitor()
			this.smoothScroll()
		},

		monitor: function () {

			if ( ! this.scrolling ) {

				var active,
					scrollTop = this.window.scrollTop() + this.options.offset + 1

				for ( var i = this.anchors.length; i--; ) {

					var anchor = this.anchors[i]

					if ( scrollTop > this.offsets[ anchor ][0] && scrollTop < this.offsets[ anchor ][1] ) {
						active = true
						this.activate( anchor )
					}
				}
				if ( ! active ) this.activate()
			}
		},

		activate: function ( anchor ) {

			if ( this.current != anchor ) {

				this.previous = this.current
				this.current = anchor

				var selector = this.options.selector || 'a'
				
				undefined != this.previous && $( this.element ).find( 'a[href="' + this.previous + '"]' ).closest( selector ).removeClass( this.options.class )
				undefined != this.current && $( this.element ).find( 'a[href="' + this.current + '"]' ).closest( selector ).addClass( this.options.class )

				this.options.activate( this )
			}
		},

		refresh: function () {

			this.anchors = []
			this.offsets = {}

			var	that = this

			$(this.element).find( 'a[href^="#"]' ).map(function () {

				var	href =  this.getAttribute( 'href' ),
					$target = /^#\w/.test(href) && $( href ).length && $( href )

				return $target && [[ href, [ $target.offset().top, $target.offset().top + $target.outerHeight(true) ] ]] || null

			}).each(function () {
				that.anchors.push( this[0] )
				that.offsets[ this[0] ] = this[1]
			})
		},

		smoothScroll: function () {

			var	that = this

			$(this.element).on('click', 'a[href="' + this.anchors.join( '"], a[href="' ) + '"]', function ( event ) {

				that.scrolling = true

				var href = this.getAttribute( 'href' )

				that.activate( href )

				$( 'body' ).stop().animate({
					scrollTop: that.offsets[ href ][0] - that.options.offset
				}, 1000, null, function() {
					that.scrolling = false
				})

				event.preventDefault()
			})
		}
	}

	$.fn.smartScroll = function ( options ) {
		return this.each(function () {
			new smartScroll( this, options )
		})
	}

}( jQuery, window );