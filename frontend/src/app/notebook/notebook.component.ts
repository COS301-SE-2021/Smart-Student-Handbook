import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';

import EditorJS from '@editorjs/editorjs';
import {NotebookService} from "../services/notebook.service";

import firebase from "firebase";
import "firebase/firestore";
import {AddNotebookComponent} from "./add-notebook/add-notebook.component";
import {ActivatedRoute, Router} from "@angular/router";
import {FolderPanelComponent} from "../components/folder-panel/folder-panel.component";
import {GlobalConfirmComponent} from "../components/modals/global/global-confirm/global-confirm.component";
import {ConfirmDeleteComponent} from "./confirm-delete/confirm-delete.component";
import {NotesPanelComponent} from "../components/folder-panel/notes-panel/notes-panel.component";


@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.scss']
})
export class NotebookComponent implements OnInit {

  //Variables for add notebook popup dialog
  title = '';
  course = '';
  description = '';
  institution = '';
  private = false;

  notebookTitle = 'New Notebook';

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

  links = ['First'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;
  notebookID: string = '';
  _editor!: EditorJS;
  t = '';

  @ViewChild('folderPanelComponent') folderPanelComponent!: FolderPanelComponent;
  @ViewChild('notePanelComponent') notePanelComponent!: NotesPanelComponent;

  /**
   * Include the notebook service
   * @param notebookService
   */
  constructor(private notebookService: NotebookService, private dialog: MatDialog,
              private router: ActivatedRoute, private _router: Router) { }


  ngOnInit() {

    this.initialFunction();

    document.addEventListener('DOMContentLoaded', (event) => {
      this.folderPanelComponent.openNotebook = () => {
        this.notePanelComponent.openedCloseToggle();
      };
    })

  }

  openPanel(){
    console.log(this.notePanelComponent);
    this.notePanelComponent.openedCloseToggle();
  }

  initialFunction(){

    //The path of the notebook to be loaded
    let path: string = '2aa5ca94-aed8-4a0a-8d54-c490086e5371';//891bdd86-0828-49ea-9053-8d60f8fdf671

    /**
     * Retrieve the notebook from realtime database
     */
    // let dbRefObject = firebase.database().ref("notebook/" + path);


    /**
     * Get the values from the realtime database and insert block if notebook is empty
     */
    // dbRefObject.once('value', snap => {
    //   if (snap.val() === null) {
    //     firebase.database().ref("notebook/" + path).set({
    //       outputData:
    //         {
    //           blocks: [
    //             {
    //               "id": "jTFbQOD8j3",
    //               "type": "header",
    //               "data": {
    //                 "text": "My Notebook 🚀",
    //                 "level": 2
    //               }
    //             }]
    //         }
    //     });
    //   }
    // });

    /**
     * Create the notebook with all the plugins
     */
    let editor = new EditorJS({
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
          blocks: []
        },
      autofocus: true,

      onChange: () => {
        (function () {
          editor.save().then((outputData) => {
            // console.log(outputData);
            firebase.database().ref("notebook/" + path).set({
              outputData
            });
          }).catch((error) => {
            console.log('Saving failed: ', error)
          })
        }());
      }
    });

    this._editor = editor;


    /**
     * Get the id of the notebook from the url parameter
     */
    this.router.queryParams.subscribe(params => {

      if (params.id !== undefined) {

          this.notebookID = path = params.id;

        /**
         * Get the specific notebook details with notebook id
         */
        this.notebookService.getNoteBookById(path)
          .subscribe(result => {

            this.notebookTitle = result.title;

            //Change the path to the correct notebook's path
            let dbRefObject = firebase.database().ref("notebook/" + path);

            /**
             * Get the values from the realtime database and insert block if notebook is empty
             */
            dbRefObject.once('value', snap => {
              if (snap.val() === null) {
                firebase.database().ref("notebook/" + path).set({
                  outputData:
                    {
                      blocks: [
                        {
                          "id": "jTFbQOD8j3",
                          "type": "header",
                          "data": {
                            "text": this.notebookTitle+ " 🚀",
                            "level": 2
                          }
                        }]
                    }
                });
              }
            })
              .then(() => {
                /**
                 * Render output on Editor
                 */
                dbRefObject.once('value', snap => {

                  // console.log(snap.val());
                  editor.render(snap.val().outputData);
                });

                //Change the path to which the editor should save data
                editor.on('change', () => {
                  (function () {
                    editor.save().then((outputData) => {
                      // console.log(outputData);
                      firebase.database().ref("notebook/" + path).set({
                        outputData
                      });
                    }).catch((error) => {
                      console.log('Saving failed: ', error)
                    })
                  }());
                });

                // dbRefObject.once('value', snap => {
                //   editor.render(snap.val().outputData);
                // });
              });
          })

      }

      //no id in the url
      else {

        /**
         * Render output on Editor
         */
        // dbRefObject.once('value', snap => {
        //   editor.render(snap.val().outputData);
        // });

      }


    });
  }

  /**
   * Add a new tab to the tabs bar
   */
  addLink(name: string) {
    this.links.push(name);
    return this.links.length;
  }

  /**
   * Create a new notebook
   */
  createNewNotebook(){

    //Open dialog
    const dialogRef = this.dialog.open(AddNotebookComponent, {
      width: '50%',
      data: {
        title: this.title,
        course: this.course,
        description: this.description,
        institution: this.institution,
        private: this.private
      }
    });

    //Get info and create notebook after dialog is closed
    dialogRef.afterClosed().subscribe(result => {

      //If the user filled out the form
      if(result !== undefined){

        //Create request object
        let request = {
          title: result.title,
          author: 'Arno',
          course: result.course,
          description: result.description,
          institution: result.institution,
          name: 'Arno',
          surname: 'Moller',
          private: result.private,
          username: 'userArno'
        }

        this.notebookTitle = result.title;

        //Call service and create notebook
        this.notebookService.createUpdateNotebook(request)
          .subscribe(result => {
            console.log(result);

            this._router.navigate(['notebook'], {queryParams: {id: result.notebookId}});

            this.folderPanelComponent.getUserNotebooks();
            // this.folderPanelComponent.openTree();

              this.notePanelComponent.getUserNotebooks();
          },
            error => {
              this.folderPanelComponent.getUserNotebooks();
            });
      }
    });

  }

  /**
   * Delete a notebook
   */
  removeNotebook(){

    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      // width: '50%',
    });

    //Get info and create notebook after dialog is closed
    dialogRef.afterClosed().subscribe(result => {

      if(result === true){
        if(this.notebookID != ''){

          this.notebookService.removeNotebook(this.notebookID)
            .subscribe(result => {
                console.log(result);

                this._router.navigate(['notebook']);

                this.folderPanelComponent.getUserNotebooks();
                let editor = this._editor;
                editor.clear();

                this.notebookTitle = '';
                this.notePanelComponent.getUserNotebooks();

              },
              error => {

                // this._router.navigate(['notebook']);
                //
                // this.folderPanelComponent.getUserNotebooks();
                //
                // let editor = this._editor;
                // editor.clear();
                //
                // this.notebookTitle = '';
              })
        }
      }
    });

  }


}
