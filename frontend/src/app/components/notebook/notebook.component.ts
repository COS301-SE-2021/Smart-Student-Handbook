import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';

import EditorJS from '@editorjs/editorjs';
import {NotebookService} from "../../services/notebook.service";


import {AddNotebookComponent} from "../modals/add-notebook/add-notebook.component";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalConfirmComponent} from "../modals/global/global-confirm/global-confirm.component";
import {AccountService} from "../../services/account.service";
import {ProfileService} from "../../services/profile.service";
import { FolderPanelComponent } from '../panels/folder-panel/folder-panel.component';
import { NotesPanelComponent } from '../panels/notes-panel/notes-panel.component';
import { ConfirmDeleteComponent } from '../modals/confirm-delete/confirm-delete.component';
import { EditorComponent } from '../editor/editor.component';

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


  // public editorData = '<p>Hello, world!</p>';

  links = ['First'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;
  notebookID: string = '';
  _editor!: EditorJS;

  //Variable that holds the logged in user details
  user: any;
  profile: any;

  @ViewChild('folderPanelComponent') folderPanelComponent!: FolderPanelComponent;
  @ViewChild('notePanelComponent') notePanelComponent!: NotesPanelComponent;
  @ViewChild('editorComponent') editorComponent!: EditorComponent;

  /**
   * Include the notebook service
   * @param notebookService
   */
  constructor(private notebookService: NotebookService, private dialog: MatDialog,
              private _router: Router, private accountService: AccountService) { }


  ngOnInit() {

    this.accountService.isUserLoggedIn();

    //Assign "openPanel function to the eventhandler from folder panel to open the note panel when the view is loaded"
    document.addEventListener('DOMContentLoaded', (event) => {
      this.folderPanelComponent.openNotebookPanel = () => {
        this.notePanelComponent.openedCloseToggle();
      };

      this.notePanelComponent.openNotebook = (id: string) => {
         this.editorComponent.loadEditor(id);
      }
    })

    // let userDeatils;
    this.user = JSON.parse(<string>localStorage.getItem('user'));
    this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));
    this.profile = this.profile.userInfo;
  }


  //Open (and close) the notes panel
  openPanel(){
    console.log(this.notePanelComponent);
    this.notePanelComponent.openedCloseToggle();
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
          author: this.profile.name,
          course: result.course,
          description: result.description,
          institution: result.institution,
          name: this.profile.name,
          private: result.private,
        }

        this.notebookTitle = result.title;

        //Call service and create notebook
        this.notebookService.createNotebook(request)
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

  async logout()
  {
    this.accountService.singOut().subscribe(data => {
        this._router.navigateByUrl(`/login`);
        localStorage.clear();
      },
      err => {
        console.log("Error: "+err.error.message);
      }
    );
  }


}
