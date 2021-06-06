/**
Core script to handle the entire layout and base functions
**/
var App = function() {

	"use strict";

	// IE mode
	var isIE8 = false;
	var isIE9 = false;
	var isIE10 = false;
	var responsiveHandlers = [];
	var layoutColorCodes = {
		'blue':   '#54728c',
		'red':    '#e25856',
		'green':  '#94B86E',
		'purple': '#852b99',
		'grey':   '#555555',
		'yellow': '#ffb848'
	};
	var sidebarWidth = '250px';

	//* BEGIN:CORE HANDLERS *//
	// this function handles responsive layout on screen size resize or mobile device rotate.
	var handleResponsive = function() {
		var isIE8 = ( navigator.userAgent.match(/msie [8]/i) );
		var isIE9 = ( navigator.userAgent.match(/msie [9]/i) );
		var isIE10 = !! navigator.userAgent.match(/MSIE 10/);

		if (isIE10) {
			$('html').addClass('ie10'); // detect IE10 version
		}

		$('.navbar li.nav-toggle').click(function() {
			$('body').toggleClass('nav-open');
		});

		/**
		 * Sidebar-Toggle-Button
		 */

		$('.toggle-sidebar').click(function(e) {
			e.preventDefault();

			// Reset manual divider-resize
			$('#sidebar').css('width', '');
			$('#sidebar > #divider').css('margin-left', '');
			$('#content').css('margin-left', '');

			// Toggle class
			$('#container').toggleClass('sidebar-closed');
		});

		/**
		 * Top-Left-Menu-Toggle-Button
		 */

		$('.toggle-top-left-menu').click(function(e) {
			e.preventDefault();

			// Toggle visibility
			$('.navbar-left.navbar-left-responsive').slideToggle(200);
		});

		var handleElements = function() {
			// First visible childs add .first
			$('.crumbs .crumb-buttons > li').removeClass('first');
			$('.crumbs .crumb-buttons > li:visible:first').addClass('first');

			// Remove phone-navigation
			if ($('body').hasClass('nav-open')) {
				$('body').toggleClass('nav-open');
			}

			// Set default visibility state
			$('.navbar-left.navbar-left-responsive').removeAttr('style');

			// Add additional scrollbars
			handleScrollbars();

			// Handle project switcher width
			handleProjectSwitcherWidth();
		}

		// handles responsive breakpoints.
		$(window).setBreakpoints({
			breakpoints: [320, 480, 768, 979, 1200]
		});

		$(window).bind('exitBreakpoint320', function() {
			handleElements();
		});
		$(window).bind('enterBreakpoint320', function() {
			handleElements();

			resetResizeableSidebar();
		});

		$(window).bind('exitBreakpoint480', function() {
			handleElements();
		});
		$(window).bind('enterBreakpoint480', function() {
			handleElements();

			resetResizeableSidebar();
		});

		$(window).bind('exitBreakpoint768', function() {
			handleElements();
		});
		$(window).bind('enterBreakpoint768', function() {
			handleElements();

			resetResizeableSidebar();
		});

		$(window).bind('exitBreakpoint979', function() {
			handleElements();
		});
		$(window).bind('enterBreakpoint979', function() {
			handleElements();
		});

		$(window).bind('exitBreakpoint1200', function() {
			handleElements();
		});
		$(window).bind('enterBreakpoint1200', function() {
			handleElements();
		});
	}

	var calculateHeight = function() {
		$('body').height('100%');

		var $header         = $('.header');
		var header_height   = $header.outerHeight();

		var document_height = $(document).height();
		var window_height   = $(window).height();

		var doc_win_diff    = document_height - window_height;

		if (doc_win_diff <= header_height) {
			var new_height  = document_height - doc_win_diff;
		} else {
			var new_height  = document_height;
		}

		new_height = new_height - header_height;

		var document_height = $(document).height();

		$('body').height(new_height);
	}

	var handleLayout = function() {
		calculateHeight();

		// For margin to top, if header is fixed
		if ($('.header').hasClass('navbar-fixed-top')) {
			$('#container').addClass('fixed-header');
		}
	}

	var handleResizeEvents = function() {
		var resizeLayout = debounce(_resizeEvents, 30);
		$(window).resize(resizeLayout);
	}

	// Executed only every 30ms
	var _resizeEvents = function() {
		calculateHeight();

		// Realign headers from DataTables (otherwise header will have an offset)
		// Only affects horizontal scrolling DataTables
		if ($.fn.dataTable) {
			var tables = $.fn.dataTable.fnTables(true);
			$(tables).each(function() {
				if (typeof $(this).data('horizontalWidth') != 'undefined') {
					$(this).dataTable().fnAdjustColumnSizing();
				}
			});
		}
	}

	/**
	 * Creates and returns a new debounced version of the passed
	 * function which will postpone its execution until after wait
	 * milliseconds have elapsed since the last time it was invoked.
	 *
	 * Source: http://underscorejs.org/
	 */
	var debounce = function(func, wait, immediate) {
		var timeout, args, context, timestamp, result;
		return function() {
			context = this;
			args = arguments;
			timestamp = new Date();
			var later = function() {
				var last = (new Date()) - timestamp;
				if (last < wait) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate) result = func.apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
			if (callNow) result = func.apply(context, args);
			return result;
		};
	};

	/**
	 * Swipe Events
	 */
	var handleSwipeEvents = function() {
		// Enable feature only on small widths
		if ($(window).width() <= 767) {

			$('body').on('movestart', function(e) {
				// If the movestart is heading off in an upwards or downwards
				// direction, prevent it so that the browser scrolls normally.
				if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
					e.preventDefault();
				}

				// Prevents showing sidebar while scrolling through projects
				var $parentClass = $(e.target).parents('#project-switcher');

				if ($parentClass.length) {
					e.preventDefault();
				}
			}).on('swipeleft', function(e) {
				// Hide sidebar on swipeleft
				$('body').toggleClass('nav-open');
			}).on('swiperight', function(e) {
				// Show sidebar on swiperight
				$('body').toggleClass('nav-open');
			});

		}
	}

	var handleSidebarMenu = function() {
		var arrow_class_open   = 'icon-angle-down',
			arrow_class_closed = 'icon-angle-left';

		$('li:has(ul)', '#sidebar-content ul').each(function() {
			if ($(this).hasClass('current') || $(this).hasClass('open-default')) {
				$('>a', this).append("<i class='arrow " + arrow_class_open + "'></i>");
			} else {
				$('>a', this).append("<i class='arrow " + arrow_class_closed + "'></i>");
			}
		});

		if ($('#sidebar').hasClass('sidebar-fixed')) {
			$('#sidebar-content').append('<div class="fill-nav-space"></div>');
		}

		$('#sidebar-content ul > li > a').on('click', function (e) {

			if ($(this).next().hasClass('sub-menu') == false) {
				return;
			}

			// Toggle on small devices instead of accordion
			if ($(window).width() > 767) {
				var parent = $(this).parent().parent();

				parent.children('li.open').children('a').children('i.arrow').removeClass(arrow_class_open).addClass(arrow_class_closed);
				parent.children('li.open').children('.sub-menu').slideUp(200);
				parent.children('li.open-default').children('.sub-menu').slideUp(200);
				parent.children('li.open').removeClass('open').removeClass('open-default');
			}

			var sub = $(this).next();
			if (sub.is(":visible")) {
				$('i.arrow', $(this)).removeClass(arrow_class_open).addClass(arrow_class_closed);
				$(this).parent().removeClass('open');
				sub.slideUp(200, function() {
					$(this).parent().removeClass('open-fixed').removeClass('open-default');
					calculateHeight();
				});
			} else {
				$('i.arrow', $(this)).removeClass(arrow_class_closed).addClass(arrow_class_open);
				$(this).parent().addClass('open');
				sub.slideDown(200, function() {
					calculateHeight();
				});
			}

			e.preventDefault();
		});

		var _handleResizeable = function() {
			$('#divider.resizeable').mousedown(function(e){
				e.preventDefault();

				var divider_width = $('#divider').width();
				$(document).mousemove(function(e){
					var sidebar_width = e.pageX+divider_width;
					if (sidebar_width <= 300 && sidebar_width >= (divider_width * 2 - 3)) {
						if (sidebar_width >= 240 && sidebar_width <= 260) {
							$('#sidebar').css("width", 250);
							$('#sidebar-content').css("width", 250);
							$('#content').css("margin-left", 250);
							$('#divider').css("margin-left", 250);
						} else {
							$('#sidebar').css("width",sidebar_width);
							$('#sidebar-content').css("width", sidebar_width);
							$('#content').css("margin-left",sidebar_width);
							$('#divider').css("margin-left",sidebar_width);
						}

					}

				})
			});
			$(document).mouseup(function(e){
				$(document).unbind('mousemove');
			});
		}

		_handleResizeable();
	}

	/**
	 * Removes the CSS-styles added with jQuery while resizing the sidebar
	 */
	var resetResizeableSidebar = function() {
		$('#sidebar').css("width", "");
		$('#sidebar-content').css("width", "");
		$('#content').css("margin-left", "");
		$('#divider').css("margin-left", "");
	}

	var handleScrollbars = function() {
		var android_chrome = /android.*chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) && android_chrome == false) {
			$('#sidebar').css('overflow-y', 'auto');
		} else {
			if ($('#sidebar').hasClass('sidebar-fixed') || $(window).width() <= 767) {

				// Since Chrome on Android has problems with scrolling only in sidebar,
				// this is a workaround for this
				//
				// Awaiting update from Google

				if (android_chrome && !$('#sidebar').hasClass('sidebar-fixed-responsive')) {
					var wheelStepInt = 100;
					$('#sidebar').attr('style', 'position: absolute !important;');

					// Fix for really high tablet resolutions
					if ($(window).width() > 979) {
						$('#sidebar').css('margin-top', '-52px');
					}

					// Only hide sidebar on phones
					if ($(window).width() <= 767) {
						$('#sidebar').css('margin-left', '-250px').css('margin-top', '-52px');
					}
				} else {
					var wheelStepInt = 7;

					$('#sidebar-content').slimscroll({
						'height': '100%',
						wheelStep: wheelStepInt
					});
				}
			}
		}
	}

	var handleThemeSwitcher = function() {
		// Add/ Removes theme-* to/ from body
		function _changeTheme(theme) {
			// Remove theme-*
			$('body').removeClass(function (index, css) {
				return (css.match (/\btheme-\S+/g) || []).join(' ');
			});

			// Select theme
			$('body').addClass('theme-' + theme);

			// Store it for page refresh
			$.cookie('theme', theme, { path: '/' });

			// Button styles
			if (theme == 'dark') {
				_toggleBtnInverse('add');
			} else {
				_toggleBtnInverse('remove');
			}
		}

		// Add/ Removes .btn-inverse to/ from switcher
		function _toggleBtnInverse(state) {
			$('#theme-switcher .btn').each(function() {
				if (state == 'add') {
					$(this).addClass('btn-inverse');
				} else {
					$(this).removeClass('btn-inverse');
				}
			});
		}

		if ($.cookie) {
			// Handles click-event on switcher
			$('#theme-switcher label').click(function() {
				var self = $(this).find('input');
				var theme = self.data('theme');

				_changeTheme(theme);
			});

			// Checks, if cookie exists
			// (If user actually changed the theme via switcher)
			if ($.cookie('theme')) {
				var cookie_theme = $.cookie('theme');
				_changeTheme(cookie_theme);

				// To select the right switch
				$('#theme-switcher input').each(function() {
					var self = $(this);
					var theme = self.data('theme');

					if (theme == cookie_theme) {
						self.parent().addClass('active');
					} else {
						self.parent().removeClass('active');
					}
				});

				// Button styles
				if (cookie_theme == 'dark') {
					_toggleBtnInverse('add');
				} else {
					_toggleBtnInverse('remove');
				}
			}
		}
	}

	var handleWidgets = function() {
		$('.widget .toolbar .widget-collapse').click(function() {
			var widget         = $(this).parents(".widget");
			var widget_content = widget.children(".widget-content");
			var widget_chart   = widget.children(".widget-chart");
			var divider        = widget.children(".divider");

			if (widget.hasClass('widget-closed')) {
				// Open Widget
				$(this).children('i').removeClass('icon-angle-up').addClass('icon-angle-down');
				widget_content.slideDown(200, function() {
					widget.removeClass('widget-closed');
				});
				widget_chart.slideDown(200);
				divider.slideDown(200);
			} else {
				// Close Widget
				$(this).children('i').removeClass('icon-angle-down').addClass('icon-angle-up');
				widget_content.slideUp(200, function() {
					widget.addClass('widget-closed');
				});
				widget_chart.slideUp(200);
				divider.slideUp(200);
			}
		});
	}

	var handleCheckableTables = function() {
		$( '.table-checkable thead th.checkbox-column :checkbox' ).on('change', function() {
			var checked = $( this ).prop( 'checked' );

			var data_horizontalWidth = $(this).parents('table.table-checkable').data('horizontalWidth');
			if (typeof data_horizontalWidth != 'undefined') {
				var $checkable_table_body = $( this ).parents('.dataTables_scroll').find('.dataTables_scrollBody tbody');
			} else {
				var $checkable_table_body = $( this ).parents('table').children('tbody');
			}

			$checkable_table_body.each(function(i, tbody) {
				$(tbody).find('.checkbox-column').each(function(j, cb) {
					var cb_self = $( ':checkbox', $(cb) ).prop( "checked", checked ).trigger('change');

					if (cb_self.hasClass('uniform')) {
						$.uniform.update(cb_self);
					}

					$(cb).closest('tr').toggleClass( 'checked', checked );
				});
			});
		});
		$( '.table-checkable tbody tr td.checkbox-column :checkbox' ).on('change', function() {
			var checked = $( this ).prop( 'checked' );
			$( this ).closest('tr').toggleClass( 'checked', checked );
		});

		// Feature to toggle header checkbox on pagination (if necessary)
		$('.datatable.table-checkable').bind('draw', function() {
			var checkboxes_count         = $('tbody tr td.checkbox-column :checkbox', this).length;
			var checkboxes_checked_count = $('tbody tr td.checkbox-column :checkbox:checked', this).length;

			var $toggle_all_checkbox     = $('thead th.checkbox-column :checkbox', this);
			var checked                  = false;

			if (checkboxes_count == checkboxes_checked_count && checkboxes_count != 0) {
				checked = true;
			} else {
				checked = false;
			}

			$toggle_all_checkbox.prop( "checked", checked );

			if ($toggle_all_checkbox.hasClass('uniform')) {
				$.uniform.update($toggle_all_checkbox);
			}
		});
	}

	var handleTabs = function() {
		// function to fix left/right tab contents
		var fixTabHeight = function(tab) {
			$(tab).each(function() {
				var content = $($($(this).attr("href")));
				var tab = $(this).parent().parent();
				if (tab.height() > content.height()) {
					content.css('min-height', tab.height());
				}
			});
		}

		// fix tab content on tab click
		$('body').on('click', '.nav.nav-tabs.tabs-left a[data-toggle="tab"], .nav.nav-tabs.tabs-right a[data-toggle="tab"]', function(){
			fixTabHeight($(this));
		});

		// fix tab contents for left/right tabs
		fixTabHeight('.nav.nav-tabs.tabs-left > li.active > a[data-toggle="tab"], .nav.nav-tabs.tabs-right > li.active > a[data-toggle="tab"]');

		// activate tab if tab id provided in the URL
		if (location.hash) {
			var tabid = location.hash.substr(1);
			$('a[href="#'+tabid+'"]').click();
		}
	}

	var handleScrollers = function() {
		$('.scroller').each(function () {
			$(this).slimScroll({
					size: '7px',
					opacity: '0.2',
					position: 'right',
					height: $(this).attr('data-height'),
					alwaysVisible: ($(this).attr('data-always-visible') == '1' ? true : false),
					railVisible: ($(this).attr('data-rail-visible') == '1' ? true : false),
					disableFadeOut: true
				});
		});
	}

	var handleProjectSwitcher = function() {
		handleProjectSwitcherWidth();

		$('.project-switcher-btn').click(function (e) {
			e.preventDefault();

			_hideVisibleProjectSwitcher(this);

			$(this).parent().toggleClass('open');

			// Define default project switcher
			var data_projectSwitcher = _getProjectSwitcherID(this);

			$(data_projectSwitcher).slideToggle(200, function() {
				$(this).toggleClass('open');
			});
		});

		// Hide project switcher on click elsewhere the element
		$('body').click(function(e) {
			var classes = e.target.className.split(' ');

			if ($.inArray('project-switcher', classes) == -1 && $.inArray('project-switcher-btn', classes) == -1
				&& $(e.target).parents().index($('.project-switcher')) == -1 && $(e.target).parents('.project-switcher-btn').length == 0) {

				_hideVisibleProjectSwitcher();

			}
		});

		/*
		 * Horizontal scrollbars
		 */

		$('.project-switcher #frame').each(function () {
			$(this).slimScrollHorizontal({
				width: '100%',
				alwaysVisible: true,
				color: '#fff',
				opacity: '0.2',
				size: '5px'
			});
		});

		var _hideVisibleProjectSwitcher = function(el) {
			$('.project-switcher').each(function () {
				var $projectswitcher = $(this);

				// Only slide up visible project switcher
				if ($projectswitcher.is(':visible')) {
					var data_projectSwitcher = _getProjectSwitcherID(el);

					if (data_projectSwitcher != ('#' + $projectswitcher.attr('id'))) {
						$(this).slideUp(200, function() {
							$(this).toggleClass('open');

							// Remove all clicked states from toggle buttons
							$('.project-switcher-btn').each(function () {
								// Define default project switcher
								var data_projectSwitcher = _getProjectSwitcherID(this);

								if (data_projectSwitcher == ('#' + $projectswitcher.attr('id'))) {
									$(this).parent().removeClass('open');
								}
							});
						});
					}
				}
			});
		}

		var _getProjectSwitcherID = function(el) {
			// Define default project switcher
			var data_projectSwitcher = $(el).data('projectSwitcher');
			if (typeof data_projectSwitcher == 'undefined') {
				data_projectSwitcher = '#project-switcher';
			}

			return data_projectSwitcher;
		}
	}

	/**
	 * Calculates project switcher width
	 */
	var handleProjectSwitcherWidth = function() {
		$('.project-switcher').each(function () {
			// To fix the hidden-width()-bug
			var $projectswitcher = $(this);
			$projectswitcher.css('position', 'absolute').css('margin-top', '-1000px').show();

			// Iterate through each li
			var total_width = 0;
			$('ul li', this).each(function() {
				total_width += $(this).outerWidth(true) + 15;
			});

			// And finally hide it again
			$projectswitcher.css('position', 'relative').css('margin-top', '0').hide();

			$('ul', this).width(total_width);
		});
	}

	//* END:CORE HANDLERS *//

	return {

		//main function to initiate template pages
		init: function() {
			//core handlers
			handleResponsive(); // Checks for IE-version, click-handler for sidebar-toggle-button, Breakpoints
			handleLayout(); // Calls calculateHeight()
			handleResizeEvents(); // Calls _resizeEvents() every 30ms on resizing
			handleSwipeEvents(); // Enables feature to swipe to the left or right on mobile phones to open the sidebar
			handleSidebarMenu(); // Handles navigation
			handleScrollbars(); // Adds styled scrollbars for sidebar on desktops
			handleThemeSwitcher(); // Bright/ Dark Switcher
			handleWidgets(); // Handle collapse and expand from widgets
			handleCheckableTables(); // Checks all checkboxes in a table if master checkbox was toggled
			handleTabs(); // Fixes tab height
			handleScrollers(); // Initializes slimscroll for scrollable widgets
			handleProjectSwitcher(); // Adds functionality for project switcher at the header
		},

		getLayoutColorCode: function(name) {
			if (layoutColorCodes[name]) {
				return layoutColorCodes[name];
			} else {
				return '';
			}
		},

		// Wrapper function to block elements (indicate loading)
		blockUI: function (el, centerY) {
			var el = $(el);
			el.block({
				message: '<img src="/content/img/ajax-loader1.gif" alt="">',
				centerY: centerY != undefined ? centerY : true,
				css: {
					top: '10%',
					border: 'none',
					padding: '2px',
					backgroundColor: 'none',
                    'z-index':'1051'
				},
				overlayCSS: {
					backgroundColor: '#000',
					opacity: 0.3,
					cursor: 'wait',
					'z-index': '1051'
				}
			});
		},

		// Wrapper function to unblock elements (finish loading)
		unblockUI: function (el) {
			$(el).unblock({
				onUnblock: function () {
					$(el).removeAttr("style");
				}
			});
		}

	};

}();

var md5 = (function () {
    function e(e, t) {
        var o = e[0], u = e[1], a = e[2], f = e[3];
        o = n(o, u, a, f, t[0], 7, -680876936);
        f = n(f, o, u, a, t[1],
            12, -389564586);
        a = n(a, f, o, u, t[2], 17, 606105819);
        u = n(u, a, f, o, t[3], 22, -1044525330);
        o = n(o, u, a, f, t[4], 7, -176418897);
        f = n(f, o, u, a, t[5],
            12, 1200080426);
        a = n(a, f, o, u, t[6], 17, -1473231341);
        u = n(u, a, f, o, t[7], 22, -45705983);
        o = n(o, u, a, f, t[8], 7, 1770035416);
        f = n(f, o, u, a, t[9],
            12, -1958414417);
        a = n(a, f, o, u, t[10], 17, -42063);
        u = n(u, a, f, o, t[11], 22, -1990404162);
        o = n(o, u, a, f, t[12], 7, 1804603682);
        f = n(f, o, u, a, t[13],
            12, -40341101);
        a = n(a, f, o, u, t[14], 17, -1502002290);
        u = n(u, a, f, o, t[15], 22, 1236535329);
        o = r(o, u, a, f, t[1], 5, -165796510);
        f = r(f, o, u, a, t[6],
            9, -1069501632);
        a = r(a, f, o, u, t[11], 14, 643717713);
        u = r(u, a, f, o, t[0], 20, -373897302);
        o = r(o, u, a, f, t[5], 5, -701558691);
        f = r(f, o, u, a, t[10],
            9, 38016083);
        a = r(a, f, o, u, t[15], 14, -660478335);
        u = r(u, a, f, o, t[4], 20, -405537848);
        o = r(o, u, a, f, t[9], 5, 568446438);
        f = r(f, o, u, a, t[14],
            9, -1019803690);
        a = r(a, f, o, u, t[3], 14, -187363961);
        u = r(u, a, f, o, t[8], 20, 1163531501);
        o = r(o, u, a, f, t[13], 5, -1444681467);
        f = r(f, o, u, a, t[2],
            9, -51403784);
        a = r(a, f, o, u, t[7], 14, 1735328473);
        u = r(u, a, f, o, t[12], 20, -1926607734);
        o = i(o, u, a, f, t[5], 4, -378558);
        f = i(f, o, u, a, t[8],
            11, -2022574463);
        a = i(a, f, o, u, t[11], 16, 1839030562);
        u = i(u, a, f, o, t[14], 23, -35309556);
        o = i(o, u, a, f, t[1], 4, -1530992060);
        f = i(f, o, u, a, t[4],
            11, 1272893353);
        a = i(a, f, o, u, t[7], 16, -155497632);
        u = i(u, a, f, o, t[10], 23, -1094730640);
        o = i(o, u, a, f, t[13], 4, 681279174);
        f = i(f, o, u, a, t[0],
            11, -358537222);
        a = i(a, f, o, u, t[3], 16, -722521979);
        u = i(u, a, f, o, t[6], 23, 76029189);
        o = i(o, u, a, f, t[9], 4, -640364487);
        f = i(f, o, u, a, t[12],
            11, -421815835);
        a = i(a, f, o, u, t[15], 16, 530742520);
        u = i(u, a, f, o, t[2], 23, -995338651);
        o = s(o, u, a, f, t[0], 6, -198630844);
        f = s(f, o, u, a, t[7],
            10, 1126891415);
        a = s(a, f, o, u, t[14], 15, -1416354905);
        u = s(u, a, f, o, t[5], 21, -57434055);
        o = s(o, u, a, f, t[12], 6, 1700485571);
        f = s(f, o, u, a, t[3],
            10, -1894986606);
        a = s(a, f, o, u, t[10], 15, -1051523);
        u = s(u, a, f, o, t[1], 21, -2054922799);
        o = s(o, u, a, f, t[8], 6, 1873313359);
        f = s(f, o, u, a, t[15],
            10, -30611744);
        a = s(a, f, o, u, t[6], 15, -1560198380);
        u = s(u, a, f, o, t[13], 21, 1309151649);
        o = s(o, u, a, f, t[4], 6, -145523070);
        f = s(f, o, u, a, t[11],
            10, -1120210379);
        a = s(a, f, o, u, t[2], 15, 718787259);
        u = s(u, a, f, o, t[9], 21, -343485551);
        e[0] = m(o, e[0]);
        e[1] = m(u, e[1]);
        e[2] = m(a, e[2]);
        e[3] = m(f, e[3])
    }

    function t(e, t, n, r, i, s) {
        t = m(m(t, e), m(r, s));
        return m(t << i | t >>> 32 - i, n)
    }

    function n(e, n, r, i, s, o, u) {
        return t(n & r | ~n & i, e, n, s, o, u)
    }

    function r(e, n, r, i, s, o, u) {
        return t(n & i | r & ~i, e, n, s, o, u)
    }

    function i(e, n, r, i, s, o, u) {
        return t(n ^ r ^ i, e, n, s, o, u)
    }

    function s(e, n, r, i, s, o, u) {
        return t(r ^ (n | ~i), e, n, s, o, u)
    }

    function o(t) {
        var n = t.length, r = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= t.length; i += 64) {
            e(r, u(t.substring(i - 64, i)))
        }
        t = t.substring(i - 64);
        var s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < t.length; i++)s[i >> 2] |= t.charCodeAt(i) << (i % 4 << 3);
        s[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
            e(r, s);
            for (i = 0; i < 16; i++)s[i] = 0
        }
        s[14] = n * 8;
        e(r, s);
        return r
    }

    function u(e) {
        var t = [], n;
        for (n = 0; n < 64; n += 4) {
            t[n >> 2] = e.charCodeAt(n) + (e.charCodeAt(n + 1) << 8) + (e.charCodeAt(n + 2) << 16) + (e.charCodeAt(n + 3) << 24)
        }
        return t
    }

    function c(e) {
        var t = "", n = 0;
        for (; n < 4; n++)t += a[e >> n * 8 + 4 & 15] + a[e >> n * 8 & 15];
        return t
    }

    function h(e) {
        for (var t = 0; t < e.length; t++)e[t] = c(e[t]);
        return e.join("")
    }

    function d(e) {
        return h(o(unescape(encodeURIComponent(e))))
    }

    function m(e, t) {
        return e + t & 4294967295
    }

    var a = "0123456789abcdef".split("");
    return d
})();

function number_format(number, decimals, dec_point, thousands_sep) {
    //  discuss at: http://phpjs.org/functions/number_format/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: davook
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Michael White (http://getsprink.com)
    // bugfixed by: Benjamin Lupton
    // bugfixed by: Allan Jensen (http://www.winternet.no)
    // bugfixed by: Howard Yeend
    // bugfixed by: Diogo Resende
    // bugfixed by: Rival
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    //  revised by: Luke Smith (http://lucassmith.name)
    //    input by: Kheang Hok Chin (http://www.distantia.ca/)
    //    input by: Jay Klehr
    //    input by: Amir Habibi (http://www.residence-mixte.com/)
    //    input by: Amirouche
    //   example 1: number_format(1234.56);
    //   returns 1: '1,235'
    //   example 2: number_format(1234.56, 2, ',', ' ');
    //   returns 2: '1 234,56'
    //   example 3: number_format(1234.5678, 2, '.', '');
    //   returns 3: '1234.57'
    //   example 4: number_format(67, 2, ',', '.');
    //   returns 4: '67,00'
    //   example 5: number_format(1000);
    //   returns 5: '1,000'
    //   example 6: number_format(67.311, 2);
    //   returns 6: '67.31'
    //   example 7: number_format(1000.55, 1);
    //   returns 7: '1,000.6'
    //   example 8: number_format(67000, 5, ',', '.');
    //   returns 8: '67.000,00000'
    //   example 9: number_format(0.9, 0);
    //   returns 9: '1'
    //  example 10: number_format('1.20', 2);
    //  returns 10: '1.20'
    //  example 11: number_format('1.20', 4);
    //  returns 11: '1.2000'
    //  example 12: number_format('1.2000', 3);
    //  returns 12: '1.200'
    //  example 13: number_format('1 000,50', 2, '.', ' ');
    //  returns 13: '100 050.00'
    //  example 14: number_format(1e-8, 8, '.', '');
    //  returns 14: '0.00000001'

    number = (number + '')
        .replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k)
                .toFixed(prec);
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
        .split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
        .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
            .join('0');
    }
    return s.join(dec);
}

function cutString(stringInput, length, more) {
    if (stringInput == "" || stringInput == null)
        return stringInput;

    stringInput = stringInput.trim();
    if (stringInput.length <= length)
        return stringInput;

    var stringArray = stringInput.split("");
    var flag = true;
    while (flag) {
        var lastManStanding = stringArray.pop();
        if ((stringArray.length <= (length + 1) && lastManStanding == " ") || stringArray.length <= length - 15) {
            flag = false;
        }
    }
    stringInput = stringArray.join("").trim() + more;
    return stringInput;
}

function VND(number) {
    return number_format(number, 0, ',', '.') + 'đ';
}

function VND2(number) {
    return number_format(number, 0, ',', '.') + ' VND';
}

function addGotoTopButton(offset) {
    if (offset == null) offset = 200;
    $('body').append('<a id="goTop"></a>');
    $(window).scroll(function () {
        if ($(this).scrollTop() > offset) {
            $('#goTop').stop().animate({
                bottom: '30px'
            }, 500);
        }
        else {
            $('#goTop').stop().animate({
                bottom: '-100px'
            }, 500);
        }
    });
    $('#goTop').click(function () {
        $('html, body').stop().animate({
            scrollTop: yPosition
        }, 500, function () {
            $('#goTop').stop().animate({
                bottom: '-100px'
            }, 500);
        });
    });
}

function addGotoBottomButton() {
    $('body').append('<a id="goBottom" onclick="goBottom()"></a>');
}

function goBottom() {
    var location = $(document).height() - $(window).height() - 27;
    if ($(window).width() <= 330 && isMobileDevice() == 1) {
        location -= 28;
    }
    $('html, body').stop().animate({
        scrollTop: location
    }, 500);
}

function addGotoElementButton(elementName, offset, position) {
    if (offset == null) offset = 200;
    if (position == null) position = 80;
    position = position + "px";

    $('body').append('<a id="goTop" onclick="gotoElement(\'' + elementName + '\')"></a>');
    $(window).scroll(function () {
        if ($(this).scrollTop() > offset) {
            $('#goTop').stop().animate({
                bottom: position
            }, 500);
        }
        else {
            $('#goTop').stop().animate({
                bottom: '-60px'
            }, 500);
        }
    });
}

function gotoElement(elementName) {
    var element = $(elementName);
    $('html, body').stop().animate({
        scrollTop: element.position().top
    }, 500, function () {
        $('#goTop').stop().animate({
            bottom: '-100px'
        }, 500);
    });
}

function hideGoToButtons() {
    var heightFromBottom = $(document).height() - $(window).scrollTop() - $(window).height();
    if(heightFromBottom < 100) {
        $('#goBottom').fadeOut("fast");
    } else {
        $('#goBottom').show();
    }
}

function isMobileDevice() {
    var x = navigator.userAgent;
    var windowPhone = "Windows Phone";
    var android = "Android";
    var iPhone = "iPhone";
    var iPad = "iPad";
    if (x.indexOf(iPhone) >= 0) return 1;
    if (x.indexOf(iPad) >= 0) return 2;
    if (x.indexOf(android) >= 0) return 3;
    if (x.indexOf(windowPhone) >= 0) return 4;

    return -1;
}

function isChromeForiPhone() {
    var x = navigator.userAgent;
    var criOS = "CriOS";
    if (x.indexOf(criOS) >= 0) return true;
    return false;
}

function isIE() {
    var x = navigator.userAgent.toLowerCase();
    var ie = "msie";

    if (x.indexOf(ie) >= 0) return true;
    return false;
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return decodeURIComponent(sParameterName[1]);
        }
    }
}

function getNumberFromString(num) {
    var output = parseInt(num);
    if (isNaN(output)) return 0;
    return output;
}

function addAddressToMap(loc, map, content, icon)
{
    var geocoderRequest = {address: loc};
    if(this.geocoder ==null || this.geocoder=='undefine')
    {
        this.geocoder =  new google.maps.Geocoder();
    }
    var pins = [];
    this.geocoder.geocode(geocoderRequest, function (results, status)
    {
        if (status == google.maps.GeocoderStatus.OK)
        {
            console.log(results);
            var lo =  results[0].geometry.location;
            var infowindow = new google.maps.InfoWindow(
                {
                    content: content
                });
            var marker = new google.maps.Marker(
                {
                    position: lo,
                    map: map ,icon : icon
                });
            pins.push(marker);
            map.setCenter(lo);
            google.maps.event.addListener(marker, 'click', function ()
            {
                infowindow.open(map, marker);
            });
        }
        else
        {
            time.
                console.log(status +":" + loc);
            return null;
        }
    });
}