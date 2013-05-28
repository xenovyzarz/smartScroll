/*!
 * jQuery smartScroll v1.1.0
 * https://github.com/happytodesign/smartScroll
 *
 * Copyright 2013 happytodesign.com (mailbox@happytodesign.com)
 * Released under the MIT license
 *
 * Date: 2013-05-15
 */

! (function( $ ) {

	"use strict";

	var defaults = {

		offset: 0,

		activeClass: 'active',
		parent: '',

		filter: '',
		hash: false,

		speed: 'relative',
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

			var that = this,
				elements = $( this.element ).find( 'a[href^="#"]' );

			if ( this.options.filter.length ) {
				elements = elements.filter( this.options.filter );
			}

			elements.map(function() {

				var	href =  this.getAttribute( 'href' ),
					target = $( href ).length && $( href );

				return target && [[ href, [ target.offset().top - that.options.offset, target.offset().top + target.outerHeight(true) - that.options.offset ] ]] || null;

			}).each(function() {
				that.element.ids .push( this[0] );
				that._offsets[ this[0] ] = this[1];
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

			if ( this.element.current !== id ) {

				var	previous = this.element.previous = this.element.current,
					current = this.element.current = id,
					parent = this.options.parent || 'a',
					activeClass = this.options.activeClass || 'active';

				undefined !== previous && $( this.element ).find( 'a[href="' + previous + '"]' ).closest( parent ).removeClass( activeClass );
				undefined !== current && $( this.element ).find( 'a[href="' + current + '"]' ).closest( parent ).addClass( activeClass );

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

				this.options.activate( this.element );
			}
		},

		_smoothScroll: function() {

			var that = this;

			$( this.element ).on( 'click', 'a[href="' + this.element.ids.join( '"], a[href="' ) + '"]', function( event ) {

				event.preventDefault();

				that._scrolling = true;

				that.options.scrollStart();
				var	href = this.getAttribute( 'href' ),
					speed = 'relative' === that.options.speed && Math.abs( ( that._offsets[ href ][0] - that.options.offset ) - that._window.scrollTop() ) || that.options.speed;

				that._activate( href );

				$( 'html, body' ).stop().animate({
					scrollTop: that._offsets[ href ][0]
				}, speed, that.options.easing, function() {
					that._scrolling = false;
					that.options.scrollEnd();
				});
			});
		}
	};

	$.fn.smartScroll = function( options ) {
		return this.each(function() {
			var scroll = new SmartScroll( this, options );
		});
	};

})( window.jQuery );