/*!
 * jQuery smartScroll v1.0.2
 * https://github.com/happytodesign/smartScroll
 *
 * Copyright 2013 happytodesign.com
 * Released under the MIT license
 *
 * Date: 2013-05-11
 */


/*-----------------------------------------------------------------------------------
	Changelog:
		v1.0.2
			- Added 'scrollStart' and 'scrollEnd' callbacks
			- Added 'relative' property to the speed option
		v1.0.1
			- Added 'speed', 'easing' options and 'activate' callback
-----------------------------------------------------------------------------------*/


! function ( $, window ) {

	var defaults = {
		offset: 0,

		class: 'active',
		selector: 'a',

		speed: 'relative',
		easing: 'swing',

		activate: function () {},
		scrollStart: function () {},
		scrollEnd: function () {}
	}

	function smartScroll ( element, options ) {

		this.window = $( window )
		this.element = element
		this.options = $.extend( defaults, options )

		this._init()
	}

	smartScroll.prototype = {

		refresh: function () {

			this.anchors = []
			this.offsets = {}

			var that = this

			$(this.element).find( 'a[href^="#"]' ).map(function () {

				var	href =  this.getAttribute( 'href' ),
					$target = /^#\w/.test(href) && $( href ).length && $( href )

				return $target && [[ href, [ $target.offset().top - that.options.offset  - 1, $target.offset().top + $target.outerHeight(true) - that.options.offset - 1 ] ]] || null

			}).each(function () {
				that.anchors.push( this[0] )
				that.offsets[ this[0] ] = this[1]
			})
		},

		_init: function () {

			var that = this

			this.window.on( 'scroll.smartScroll', $.proxy( this._monitor, this ) )

			this.window.on( 'mousedown.smartScroll mousewheel.smartScroll keyup.smartScroll', function ( e ) {
				if ( that.scrolling ) {
					that.scrolling = false
					$( 'html, body' ).stop()
				}
			})

			this.refresh()
			this._monitor()
			this._smoothScroll()
		},

		_monitor: function () {

			if ( ! this.scrolling ) {

				var	active,
					scrollTop = this.window.scrollTop()

				for ( var i = this.anchors.length; i--; ) {

					var anchor = this.anchors[i]

					if ( scrollTop >= this.offsets[ anchor ][0] && scrollTop <= this.offsets[ anchor ][1] ) {

						active = true
						this._activate( anchor )
					}
				}
				if ( ! active ) this._activate()
			}
		},

		_activate: function ( anchor ) {

			if ( this.current != anchor ) {

				this.previous = this.current
				this.current = anchor

				var selector = this.options.selector || 'a'
				
				undefined != this.previous && $( this.element ).find( 'a[href="' + this.previous + '"]' ).closest( selector ).removeClass( this.options.class )
				undefined != this.current && $( this.element ).find( 'a[href="' + this.current + '"]' ).closest( selector ).addClass( this.options.class )

				this.options.activate( this.current, this.previous )
			}
		},

		_smoothScroll: function () {

			var that = this

			$(this.element).on( 'click', 'a[href="' + this.anchors.join( '"], a[href="' ) + '"]', function ( event ) {

				that.scrolling = true

				this.options.scrollStart()

				var	href = this.getAttribute( 'href' ),
					destination = that.offsets[ href ][0] + 1
					speed = 'relative' == that.options.speed && Math.abs( ( that.offsets[ href ][0] - that.options.offset ) - that.window.scrollTop() ) || that.options.speed

				that._activate( href )

				$( 'html, body' ).stop().animate({
					scrollTop: destination
				}, speed, that.options.easing, function() {
					that.scrolling = false
					this.options.scrollEnd()
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