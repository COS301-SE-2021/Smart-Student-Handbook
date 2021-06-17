import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
// import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import EditorJS from '@editorjs/editorjs';
import {NotebookService} from "../services/notebook.service";



@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss']
})
export class NotebookComponent implements OnInit {

  // @ts-ignore
  Header = require('@editorjs/header');
  // @ts-ignore
  LinkTool = require('@editorjs/link');
  // @ts-ignore
  RawTool = require('@editorjs/raw');
  // @ts-ignore
  SimpleImage = require('@editorjs/simple-image');
  // @ts-ignore
  Checklist = require('@editorjs/checklist');
  // @ts-ignore
  List = require('@editorjs/list');
  // @ts-ignore
  Embed = require('@editorjs/embed');
  // @ts-ignore
  Quote = require('@editorjs/quote');


  public editorData = '<p>Hello, world!</p>';

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  constructor(private notebookService: NotebookService) { }

  ngOnInit(): void {

    const editor = new EditorJS({
      holder: 'editor',
      tools: {
        header: {
          class: this.Header,
          shortcut: 'CTRL+SHIFT+H'
        },
        // linkTool: {
        //   class: this.LinkTool,
        //   config: {
        //     endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching
        //   }
        // },
        raw: this.RawTool,
        image: this.SimpleImage,
        checklist: {
          class: this.Checklist,
          inlineToolbar: true,
        },
        list: {
          class: this.List,
          inlineToolbar: true,
        },
        embed: this.Embed,
        quote: this.Quote,
      }
    });

    this.notebookService.getNoteBookById('aICV0OnPUusxezbYm1Dw')
      .subscribe(result => {
        console.log(result);
      })

  }

}
