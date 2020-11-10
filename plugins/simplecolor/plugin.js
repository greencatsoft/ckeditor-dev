/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The "simplecolor" plugin that makes it possible to assign
 *			   text and background colors to editor contents.
 *
 */
CKEDITOR.plugins.add( 'simplecolor', {
	// jscs:disable maximumLineLength
	lang: 'ko,en',
	// jscs:enable maximumLineLength
	icons: 'bgcolor,textcolor', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function( editor ) {
		var config = editor.config,
			lang = editor.lang.simplecolor;

		if ( !CKEDITOR.env.hc ) {
			addButton( 'TextColor', 'fore', lang.textColorTitle, 10 );
			addButton( 'BGColor', 'back', lang.bgColorTitle, 20 );
		}

		function addButton( name, type, title, order, options ) {
			var commandId = 'simplecolor_' + type + 'Style';
			var style = new CKEDITOR.style( config[ commandId ] );

			var getColor = function() {
				var selection = editor.getSelection(),
					block = selection && selection.getStartElement(),
					path = editor.elementPath( block ),
					automaticColor;

				if ( !path )
					return;

				// Find the closest block element.
				block = path.block || path.blockLimit || editor.document.getBody();

				// The background color might be transparent. In that case, look up the color in the DOM tree.
				do {
					automaticColor = block && block.getComputedStyle( type == 'back' ? 'background-color' : 'color' ) || 'transparent';
				}
				while ( type == 'back' && automaticColor == 'transparent' && block && ( block = block.getParent() ) );

				var range = selection && selection.getRanges()[ 0 ];

				if ( range ) {
					var walker = new CKEDITOR.dom.walker( range ),
						element = range.collapsed ? range.startContainer : walker.next(),
						finalColor = '',
						currentColor;

					while ( element ) {
						// (#2296)
						if ( element.type !== CKEDITOR.NODE_ELEMENT ) {
							element = element.getParent();
						}

						currentColor = normalizeColor( element.getComputedStyle( type == 'back' ? 'background-color' : 'color'  ) );
						finalColor = finalColor || currentColor;

						if ( finalColor !== currentColor ) {
							finalColor = '';
							break;
						}

						element = walker.next();
					}

					return finalColor;
				}

				return automaticColor;
			}

			var setColor = function( color ) {
				var colorStyle = config[ commandId ];

				editor.removeStyle( new CKEDITOR.style( colorStyle, { color: 'inherit' } ) );

				colorStyle.childRule = type == 'back' ?

				function( element ) {
					// It's better to apply background color as the innermost style. (https://dev.ckeditor.com/ticket/3599)
					// Except for "unstylable elements". (https://dev.ckeditor.com/ticket/6103)
					return isUnstylable( element );
				} : function( element ) {
					// Fore color style must be applied inside links instead of around it. (https://dev.ckeditor.com/ticket/4772,https://dev.ckeditor.com/ticket/6908)
					return !( element.is( 'a' ) || element.getElementsByTag( 'a' ).count() ) || isUnstylable( element );
				};

				editor.focus();

				if ( color ) {
					editor.applyStyle( new CKEDITOR.style( colorStyle, { color: color } ) );
				}

				editor.fire( 'saveSnapshot' );
			}

			var command = new CKEDITOR.command( editor, {
   				exec: function( editor ) {
					editor.getColorFromDialog( function( color ) {
						if ( color ) {
							setColor( color );
						}
					}, this, getColor() );
				},
				allowedContent: style,
				requiredContent: style
			} );

			editor.addCommand( commandId, command );

			options = options || {};

			editor.ui.addButton( name, {
				label: title,
				title: title,
				toolbar: 'colors,' + order,
				command: commandId } );
		}

		function isUnstylable( ele ) {
			return ( ele.getAttribute( 'contentEditable' ) == 'false' ) || ele.getAttribute( 'data-nostyle' );
		}

		/*
		 * Converts a CSS color value to an easily comparable form.
		 *
		 * @private
		 * @member CKEDITOR.plugins.simplecolor
		 * @param {String} color
		 * @returns {String}
		 */
		function normalizeColor( color ) {
			// Replace 3-character hexadecimal notation with a 6-character hexadecimal notation (#1008).
			return CKEDITOR.tools.normalizeHex( '#' + CKEDITOR.tools.convertRgbToHex( color || '' ) ).replace( /#/g, '' );
		}
	}
} );

/**
 * Stores the style definition that applies the text foreground color.
 *
 * Read more in the {@glink guide/dev_simplecolor documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/simplecolor.html).
 *
 *		// This is actually the default value.
 *		config.simplecolor_foreStyle = {
 *			element: 'span',
 *			styles: { color: '#(color)' }
 *		};
 *
 * @cfg [simplecolor_foreStyle=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.simplecolor_foreStyle = {
	element: 'span',
	styles: { 'color': '#(color)' },
	overrides: [ {
		element: 'font', attributes: { 'color': null }
	} ]
};

/**
 * Stores the style definition that applies the text background color.
 *
 * Read more in the {@glink guide/dev_simplecolor documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/simplecolor.html).
 *
 *		// This is actually the default value.
 *		config.simplecolor_backStyle = {
 *			element: 'span',
 *			styles: { 'background-color': '#(color)' }
 *		};
 *
 * @cfg [simplecolor_backStyle=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.simplecolor_backStyle = {
	element: 'span',
	styles: { 'background-color': '#(color)' }
};

