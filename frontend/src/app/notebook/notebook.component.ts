import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import EditorJS from '@editorjs/editorjs';
import {NotebookService} from "../services/notebook.service";

import firebase from "firebase";
import "firebase/firestore";


@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss']
})
export class NotebookComponent implements OnInit {

  /**
    Get all plugins for notebook
   */
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
  // @ts-ignore
  NestedList = require('@editorjs/nested-list');
  // @ts-ignore
  Underline = require('@editorjs/underline');
  // @ts-ignore
  Table = require('@editorjs/table');
  // @ts-ignore
  Warning = require('@editorjs/warning');
  // @ts-ignore
  CodeTool = require('@editorjs/code');
  // @ts-ignore
  // Paragraph = require('@editorjs/paragraph');
  // @ts-ignore
  TextVariantTune = require('@editorjs/text-variant-tune');
  // @ts-ignore
  AttachesTool = require('@editorjs/attaches');
  // @ts-ignore
  Marker = require('@editorjs/marker');
  // @ts-ignore
  InlineCode = require('@editorjs/inline-code');
  // @ts-ignore
  Personality = require('@editorjs/personality');
  // @ts-ignore
  Delimiter = require('@editorjs/delimiter');
  // @ts-ignore
  Alert = require('editorjs-alert');
  // @ts-ignore
  Paragraph = require('editorjs-paragraph-with-alignment');


  // public editorData = '<p>Hello, world!</p>';

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  /**
   * Add a new tab to the tabs bar
   */
  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  /**
   * Include the notebook service
   * @param notebookService
   */
  constructor(private notebookService: NotebookService) { }


  ngOnInit(): void {

    //The path of the notebook to be loaded
    let path: string = 'test';

    /**
     * Get the specific notebook details with notebook id
     */
    this.notebookService.getNoteBookById('aICV0OnPUusxezbYm1Dw')
      .subscribe(result => {
        console.log(result);
        // path = result.notebookReference;
      })


    /**
     * Retrieve the notebook from realtime database
     */
    const dbRefObject = firebase.database().ref("notebook/" + path);

    /**
     * Get the values from the realtime database and insert block if notebook is empty
     */
    dbRefObject.once('value', snap =>
    {
      if(snap.val() === null)
      {
        firebase.database().ref("notebook/" + path).set({
          outputData:
            {
              blocks: [
                {
                  "id" : "jTFbQOD8j3",
                  "type" : "header",
                  "data" : {
                    "text" : "My Notebook 🚀",
                    "level" : 2
                  }
                }]
            }
        });
      }
    });

    /**
     * Create the notebook with all the plugins
     */
    const editor = new EditorJS({
      holder: 'editor',
      tools: {
        header: {
          class: this.Header,
          shortcut: 'CTRL+SHIFT+H'
        },
        linkTool: {
          class: this.LinkTool,
          // config: {
          //   endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching
          // }
        },
        raw: this.RawTool,
        image: this.SimpleImage,
        checklist: {
          class: this.Checklist,
          inlineToolbar: true,
        },
        list: {
          class: this.NestedList,
          inlineToolbar: true,
        },
        embed: this.Embed,
        quote: this.Quote,
        underline: this.Underline,
        table: {
          class: this.Table,
        },
        warning: {
          class: this.Warning,
          inlineToolbar: true,
          shortcut: 'CTRL+SHIFT+W',
          config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message',
          },
        },
        code: this.CodeTool,
        paragraph: {
          class: this.Paragraph,
          inlineToolbar: true,
        },
        textVariant: this.TextVariantTune,
        attaches: {
          class: this.AttachesTool,
          // config: {
          //   endpoint: 'http://localhost:8008/uploadFile'
          // }
        },
        Marker: {
          class: this.Marker,
          shortcut: 'CTRL+SHIFT+M',
        },
        inlineCode: {
          class: this.InlineCode,
          shortcut: 'CMD+SHIFT+M',
        },
        personality: {
          class: this.Personality,
          // config: {
          //   endpoint: 'http://localhost:8008/uploadFile'  // Your backend file uploader endpoint
          // }
        },
        delimiter: this.Delimiter,
        alert: this.Alert,
      },
      data:
        {
          blocks:[]
        },
      autofocus: true,

      onChange: () => {
        (function() {
          editor.save().then((outputData) => {
            // console.log(outputData);
            firebase.database().ref("notebook/" + path ).set({
              outputData
            });
          }).catch((error) => {
            console.log('Saving failed: ', error)
          })
        }());
      }
    })

    /**
     * Render output on Editor
     */
    dbRefObject.once('value', snap =>
    {
      editor.render(snap.val().outputData);
    });


  }

  /**
   * Create a new notebook
   */
  createNewNotebook(){
    let request = {
      title: 'title 2',
      author: 'author',
      course: 'COS 301',
      description: 'Test',
      institution: 'Tuks',
      name: 'Arno',
      surname: 'Moller',
      private: false,
      username: 'username',
    }

    this.notebookService.createNotebook(request, 'zsm6CotjuAVMUynICGD5QCiQNGl2')
      .subscribe(result => {
        console.log(result);
      })
  }

  /**
   * Delete a notebook
   */
  removeNotebook(){
    this.notebookService.removeNotebook('9c1b694e-24af-4844-b4ad-789068b4c3bc')
      .subscribe(result => {
        console.log(result);
      })

  }

}
