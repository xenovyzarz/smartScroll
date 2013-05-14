/*!
 * jQuery smartScroll v1.0.4
 * https://github.com/happytodesign/smartScroll
 *
 * Copyright 2013 happytodesign.com (mailbox@happytodesign.com)
 * Released under the MIT license
 *
 * Date: 2013-05-14
 */

! function( $, window ) {

	var defaults = {

		offset: 0,

		activeClass: 'active',
		parent: '',

		filter: '',

		speed: 'relative',
		easing: 'swing',

		activate: function() {},
		scrollStart: function() {},
		scrollEnd: function() {}
	}

	function smartScroll( element, options ) {

		this.element = element
		this.options = $.extend( defaults, options )

		this._window = $( window )

		this._init()
	}

	smartScroll.prototype = {

		refresh: function() {

			this._ids = []
			this._offsets = {}

			var that = this,
				elements = $( this.element ).find( 'a[href^="#"]' )

			if ( this.options.filter.length ) {
				elements = elements.filter( this.options.filter )
			}

			elements.map(function() {

				var	href =  this.getAttribute( 'href' ),
					target = $( href ).length && $( href )

				return target && [[ href, [ target.offset().top - that.options.offset, target.offset().top + target.outerHeight(true) - that.options.offset ] ]] || null

			}).each(function( i ) {
				that._ids.push( this[0] )
				that._offsets[ this[0] ] = this[1]
			})
		},

		_monitor: function() {

			if ( ! this._scrolling ) {

				var	id,
					ids = this._ids,
					offsets = this._offsets,
					scrollTop = this._window.scrollTop()

				for ( var i = ids.length; i--; ) {

					var current = ids[i]

					if ( scrollTop >= offsets[ current ][0] && scrollTop <= offsets[ current ][1] ) {
						id = current
						break;
					}
				}
				id ? this._activate( id ) : this._activate()
			}
		},

		_init: function() {

			this.refresh()
			this._monitor()
			this._smoothScroll()

			var	t,
				w = this._window,
				that = this,
				refresh = $.proxy( this.refresh, this )

			w.on( 'scroll.smartScroll', $.proxy( this._monitor, this ) )

			w.on( 'mousedown.smartScroll mousewheel.smartScroll keyup.smartScroll', function() {
				if ( that._scrolling ) {
					that._scrolling = false
					$( 'html, body' ).stop()
				}
			})

			w.on( 'resize.smartScroll', function() {
				clearTimeout(t)
				t = setTimeout(function() {
					refresh()
				}, 100)
			})
		},

		_activate: function( id ) {

			if ( this.element.current != id ) {

				var previous = this.element.previous = this.element.current,
					current = this.element.current = id,
					parent = this.options.parent || 'a',
					activeClass = this.options.activeClass || 'active'
				
				undefined != previous && $( this.element ).find( 'a[href="' + previous + '"]' ).closest( parent ).removeClass( activeClass )
				undefined != current && $( this.element ).find( 'a[href="' + current + '"]' ).closest( parent ).addClass( activeClass )

				this.options.activate( this.element )
			}
		},

		_smoothScroll: function() {

			var that = this

			$( this.element ).on( 'click', 'a[href="' + this._ids.join( '"], a[href="' ) + '"]', function( event ) {

				that._scrolling = true

				that.options.scrollStart()
					
				var	href = this.getAttribute( 'href' )
					speed = 'relative' == that.options.speed && Math.abs( ( that._offsets[ href ][0] - that.options.offset ) - that._window.scrollTop() ) || that.options.speed

				that._activate( href )

				$( 'html, body' ).stop().animate({
					scrollTop: that._offsets[ href ][0]
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