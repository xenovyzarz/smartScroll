/*!
 * jQuery smartScroll v1.0.3
 * https://github.com/happytodesign/smartScroll
 *
 * Copyright 2013 happytodesign.com (mailbox@happytodesign.com)
 * Released under the MIT license
 *
 * Date: 2013-05-12
 */

! function( $, window ) {

	var defaults = {
		offset: 0,

		class: 'active',
		parent: '',

		speed: 'relative',
		easing: 'swing',

		activate: function() {},
		scrollStart: function() {},
		scrollEnd: function() {}
	}

	function smartScroll( element, options ) {

		this.window = $( window )
		this.element = element
		this.options = $.extend( defaults, options )

		this._init()
	}

	smartScroll.prototype = {

		refresh: function() {

			this.element.anchors = []
			this.offsets = {}

			var that = this

			$(this.element).find( 'a[href^="#"]' ).map(function() {

				var	href =  this.getAttribute( 'href' ),
					$target = /^#\w/.test(href) && $( href ).length && $( href )

				return $target && [[ href, [ $target.offset().top - that.options.offset  - 1, $target.offset().top + $target.outerHeight(true) - that.options.offset - 1 ] ]] || null

			}).each(function() {
				that.element.anchors.push( this[0] )
				that.offsets[ this[0] ] = this[1]
			})
		},

		_init: function() {

			var	t, 
				that = this, 
				refresh = $.proxy( this.refresh, this )

			this.window.on( 'scroll.smartScroll', $.proxy( this._monitor, this ) )

			this.window.on( 'mousedown.smartScroll mousewheel.smartScroll keyup.smartScroll', function( e ) {
				if ( that._scrolling ) {
					that._scrolling = false
					$( 'html, body' ).stop()
				}
			})

			this.window.on( 'resize.smartScroll', function() {
				clearTimeout( t )
				t = setTimeout(function() {
					refresh()
				}, 100)
			} )

			this.refresh()
			this._monitor()
			this._smoothScroll()
		},

		_monitor: function() {

			if ( ! this._scrolling ) {

				var	id,
					scrollTop = this.window.scrollTop()

				for ( var i = this.element.anchors.length; i--; ) {

					var current = this.element.anchors[i]

					if ( scrollTop >= this.offsets[ current ][0] && scrollTop <= this.offsets[ current ][1] ) {
						id = current
						break;
					}
				}
				id ? this._activate( id ) : this._activate()
			}
		},

		_activate: function( id ) {

			if ( this.element.current != id ) {

				this.element.previous = this.element.current
				this.element.current = id

				var parent = this.options.parent || 'a'
				
				undefined != this.element.previous && $( this.element ).find( 'a[href="' + this.element.previous + '"]' ).closest( parent ).removeClass( this.options.class )
				undefined != this.element.current && $( this.element ).find( 'a[href="' + this.element.current + '"]' ).closest( parent ).addClass( this.options.class )

				this.options.activate( this.element.current, this.element.previous )
			}
		},

		_smoothScroll: function() {

			var that = this

			$(this.element).on( 'click', 'a[href="' + this.element.anchors.join( '"], a[href="' ) + '"]', function( event ) {

				that._scrolling = true

				that.options.scrollStart()

				var	href = this.getAttribute( 'href' ),
					destination = that.offsets[ href ][0] + 1
					speed = 'relative' == that.options.speed && Math.abs( ( that.offsets[ href ][0] - that.options.offset ) - that.window.scrollTop() ) || that.options.speed

				that._activate( href )

				$( 'html, body' ).stop().animate({
					scrollTop: destination
				}, speed, that.options.easing, function() {
					that._scrolling = false
					that.options.scrollEnd()
				})

				event.preventDefault()
			})
		}
	}

	$.fn.smartScroll = function( options ) {
		return this.each(function() {
			new smartScroll( this, options )
		})
	}

}( jQuery, window );