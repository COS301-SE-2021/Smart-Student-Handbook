import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';

declare let DecoupledEditor: any;

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss']
})
export class NotebookComponent implements OnInit {

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;



  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  constructor() { }

  ngOnInit(): void {
    window.addEventListener('load', function () {

      DecoupledEditor
        .create( document.querySelector( '#editor' ) )
        .then( (editor:any) => {
            const toolbarContainer = document.getElementById( 'toolbar-container' );

            if(toolbarContainer)
            toolbarContainer.appendChild( editor.ui.view.toolbar.element );
        } )
        .catch( (error: any) => {
            console.error( error );
        } );
    })


  }

}
