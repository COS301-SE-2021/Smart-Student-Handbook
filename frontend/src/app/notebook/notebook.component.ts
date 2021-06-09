import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss']
})
export class NotebookComponent implements OnInit {

  editor = DecoupledEditor;
  toolbar: any = ['heading', '|', 'bold',
    'italic', 'fontSize', 'fontFamily', 'underline', 'strikethrough', 'alignment',
    'highlight', 'numberedList', 'insertTable',
    'bulletedList', '|', 'indent',
    'outdent', 'undo', 'redo', 'exportPdf', 'exportWord', 'fontBackgroundColor',
    'fontColor'];

  heading = {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
      { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
      { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
    ]
  };

  public editorData = '<p>Hello, world!</p>';

  public Editor = DecoupledEditor;

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;



  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  constructor() { }

  public onReady( editor: any ) {
    // editor.ui.getEditableElement().parentElement.insertBefore(
    //     editor.ui.view.toolbar.element,
    //     editor.ui.getEditableElement()
    // );

    console.log(editor);
  }

  ngOnInit(): void {

    DecoupledEditor.create(document.querySelector('.document-editor__editable'), {
      fontSize: { options: [9, 11, 12, 13, 'default', 17, 19, 21] },
      // toolbar: this.opciones,
      // heading: this.heading,
    }).then((editor:any)  => {
      const toolbarContainer = document.querySelector('.document-editor__toolbar');

      if(toolbarContainer)
      toolbarContainer.appendChild(editor.ui.view.toolbar.element);

      this.Editor = editor;
    }).catch((err: any) => {
      console.error(err);
    });

    // window.addEventListener('load', function () {

    //   DecoupledEditor
    //     .create( document.querySelector( '#editor' ) )
    //     .then( (editor:any) => {
    //         const toolbarContainer = document.getElementById( 'toolbar-container' );

    //         if(toolbarContainer)
    //         toolbarContainer.appendChild( editor.ui.view.toolbar.element );
    //     } )
    //     .catch( (error: any) => {
    //         console.error( error );
    //     } );
    // })


  }

}
