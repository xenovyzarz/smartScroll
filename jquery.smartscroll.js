/*!
 * jQuery smartScroll v1.2.0
 * https://github.com/happytodesign/smartScroll
 *
 * Copyright 2013 happytodesign.com (mailbox@happytodesign.com)
 * Released under the MIT license
 *
 * Date: 2013-06-01
 */

! (function( $ ) {

	"use strict";

	var defaults = {

		offset: 0,

		activeClass: 'active',
		activeParent: '',

		filter: '',
		hash: false,

		speed: 'relative',
		maxSpeed: 2000,
		easing: 'swing',

		activate: function() {},
		scrollStart: function() {},
		scrollEnd: function() {}
	};

	function SmartScroll( element, options ) {

		this.element = element;
		this.options = $.extend( defaults, options );

		this._window = $( window );

		this._init();
	}

	SmartScroll.prototype = {

		constructor: SmartScroll,

		refresh: function() {

			this.element.ids = [];
			this._offsets = {};

			var	that = this,
				elements = $( this.element ).find( '[href^="#"], [data-target^="#"]' );
				 
			if ( this.options.filter ) {
				elements = elements.filter( this.options.filter );
			}

			elements.each(function() {

				var	id =  this.getAttribute( 'href' ) || $( this ).data( 'target' ),
					target = $( id ).length && $( id );

				if ( target ) {
					this.setAttribute( 'data-target', id );
					that.element.ids.push( id );
					that._offsets[ id ] = [ target.offset().top - that.options.offset, target.offset().top + target.outerHeight(true) - that.options.offset ];
				}
			});
		},

		_init: function() {

			this.refresh();
			this._monitor();
			this._smoothScroll();

			var	w = this._window,
				that = this,
				refresh = $.proxy( this.refresh, this );

			w.on( 'scroll.smartScroll', $.proxy( this._monitor, this ) );

			w.on( 'mousedown.smartScroll mousewheel.smartScroll keyup.smartScroll', function() {
				if ( that._scrolling ) {
					that._scrolling = false;
					$( 'html, body' ).stop();
				}
			});

			w.on( 'resize.smartScroll', function() {
				clearTimeout( this._refreshTimer );
				this._refreshTimer = setTimeout(function() {
					refresh();
				}, 25);
			});
		},

		_monitor: function() {

			if ( ! this._scrolling ) {

				var	id,
					ids = this.element.ids,
					offsets = this._offsets,
					scrollTop = this._window.scrollTop();

				for ( var i = ids.length; i--; ) {

					var current = ids[i];

					if ( scrollTop >= offsets[ current ][0] && scrollTop <= offsets[ current ][1] ) {
						id = current;
						break;
					}
				}
				id ? this._activate( id ) : this._activate();
			}
		},

		_activate: function( id ) {

			var element = this.element;

			if ( element.current !== id ) {

				element.previous = element.current;

				var	current = element.current = id,
					currentElement = $( element ).find( '[data-target="' + current + '"]' ),
					activeParent = this.options.activeParent,
					activeClass = this.options.activeClass || 'active';

				$( element ).find( '.' + activeClass ).removeClass( activeClass );

				if ( undefined !== current ) {
					if ( currentElement.closest( activeParent, element ).length ) {
						currentElement.closest( activeParent, element ).addClass( activeClass );
					}
					else {
						currentElement.addClass( activeClass );
					}
				}

				if ( this.options.hash ) {
					var hash = current;

					if ( undefined === hash ) {
						hash = window.location.pathname;
					}

					hash = hash + window.location.search;

					clearTimeout( this._hashTimer );
					this._hashTimer = setTimeout(function() {
						history.replaceState( {}, '', hash );
					}, 250);
				}

				this.options.activate( element );
			}
		},

		_smoothScroll: function() {

			var that = this;

			$( that.element ).on( 'click', '[data-target="' + that.element.ids.join( '"], [data-target="' ) + '"]', function( event ) {

				event.preventDefault();

				that._scrolling = true;

				that.options.scrollStart();

				var	id = this.getAttribute( 'data-target' ),
					speed = 'relative' === that.options.speed && Math.abs( ( that._offsets[ id ][0] - that.options.offset ) - that._window.scrollTop() ) || that.options.speed;

				if ( speed > that.options.maxSpeed ) {
					speed = that.options.maxSpeed;
				}

				that._activate( id );

				$( 'html, body' ).stop().animate({
					scrollTop: that._offsets[ id ][0]
				}, speed, that.options.easing, function() {
					that._scrolling = false;
					that.options.scrollEnd();
				});
			});
		}
	};

	$.fn.smartScroll = function( options ) {
		return this.each(function() {
			new SmartScroll( this, options );
		});
	};

})( window.jQuery );