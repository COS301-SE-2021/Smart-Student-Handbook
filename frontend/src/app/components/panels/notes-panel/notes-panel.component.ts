import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {NotebookService} from "../../../services/notebook.service";
import {Router} from "@angular/router";
import {AddNotebookComponent} from "../../modals/add-notebook/add-notebook.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-notes-panel',
  templateUrl: './notes-panel.component.html',
  styleUrls: ['./notes-panel.component.scss']
})

@Injectable()
export class NotesPanelComponent implements OnInit {

  //Variables for add notebook popup dialog
  title = '';
  course = '';
  description = '';
  institution = '';
  private = false;

  //Variable that holds the logged in user details
  user: any;
  profile: any;

  //sliding panel
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public closeNotePanelBtn: any;

  open = false;

  public notebooks: any = [];

  constructor(private notebookService: NotebookService, private router: Router, private dialog: MatDialog) { }

  async ngOnInit() {

    this.getUserNotebooks();

    // let userDeatils;
    this.user = JSON.parse(<string>localStorage.getItem('user'));
    this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));
    this.profile = this.profile.userInfo;
  }

  getUserNotebooks(){
    this.notebooks = [];

    this.notebookService.getUserNotebooks('zsm6CotjuAVMUynICGD5QCiQNGl2')
      .subscribe(result => {

        for(let i = 0; i < result.length; i++){
          this.notebooks.push(result[i]);
        }
      });
  }

  public openedCloseToggle(){

    this.sidenav.toggle();

    this.open = true;

    // console.log(this.open);

    const sideNavContainer = document.getElementById('notes-container') as HTMLElement;
    const col = sideNavContainer?.parentElement?.parentElement;

    if(sideNavContainer.style.width === '100%')
    {
      sideNavContainer.style.width = '40px';

      if(col){
        col.style.width = 'fit-content';
        col.style.minWidth = '0px';
      }

    }
    else{
      sideNavContainer.style.width = '100%';

      if(col){
        col.style.width = '16.6666666667%';
        col.style.minWidth = '250px';
      }
    }

  }

  //open a specific nptebook
  openNotebook(id: string){

  }

  //Edit a notebook
  editNotebook(id: string){

    //Get the notebook info to edit
    this.notebookService.getNoteBookById(id)
    .subscribe(result => {
      console.log(result);

      this.title  = result.title;
      this.course  = result.course;
      this.description = result.description;
      this.institution = result.institution;
      this.private  = result.private ;

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
        if (result !== undefined) {

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

          //Call service and create notebook
          this.notebookService.updateNotebook(request, id)
            .subscribe(result => {
                console.log(result);
                this.getUserNotebooks();
              },
              error => {
                console.log(error);
              });
        }
      })
    });
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

        // this.notebookTitle = result.title;

        //Call service and create notebook
        this.notebookService.createNotebook(request)
          .subscribe(result => {
            console.log(result);

            // this._router.navigate(['notebook'], {queryParams: {id: result.notebookId}});

            // this.folderPanelComponent.getUserNotebooks();
            // this.folderPanelComponent.openTree();

              // this.notePanelComponent.getUserNotebooks();
          },
            error => {
              // this.folderPanelComponent.getUserNotebooks();
            });
      }
    });

  }
}
