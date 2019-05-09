/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'justifysplit', {
	requires: 'splitbutton,justify',
	init: function( editor ) {

		editor.ui.add( 'JustifySplit', CKEDITOR.UI_SPLITBUTTON, {
			label: 'Text Align',
			items: [ {
				label: editor.lang.common.alignLeft,
				command: 'justifyleft',
				icon: 'justifyleft',
				'default': true
			}, {
				label: editor.lang.common.center,
				command: 'justifycenter',
				icon: 'justifycenter'
			}, {
				label: editor.lang.common.alignRight,
				command: 'justifyright',
				icon: 'justifyright'
			}, {
				label: editor.lang.common.justify,
				command: 'justifyblock',
				icon: 'justifyblock'
			} ]
		} );
	}
} );
