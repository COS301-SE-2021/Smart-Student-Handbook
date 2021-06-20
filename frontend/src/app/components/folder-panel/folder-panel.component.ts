import { NotesPanelComponent } from './notes-panel/notes-panel.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatTree, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { ViewEncapsulation } from '@angular/core';
import {NotebookService} from "../../services/notebook.service";
import {Router} from "@angular/router";
import {ProfileService} from "../../services/profile.service";
import {MatSidenav} from "@angular/material/sidenav";
import {EditProfileComponent} from "../../notebook/edit-profile/edit-profile.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-folder-panel',
  templateUrl: './folder-panel.component.html',
  styleUrls: ['./folder-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FolderPanelComponent implements OnInit {

  user: any;
  profile: any;
  open: boolean = false;

  username: string = '';
  bio: string = '';
  institution: string = '';
  department: string = '';
  name: string = '';
  program: string = '';
  workstatus: string = '';

  panelOpenState = false;
  width = 68.3;

  //-----------------  Code needed for the tree  ----------------------------------
  private _transformer = (node: DirectoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level: level,
    };
  }

  //Variables needed for the tree view
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  //--------------------------------------------------------------------------------


  constructor(private panel: NotesPanelComponent, private notebookService: NotebookService,
              private router: Router, private profileService: ProfileService,
              private dialog: MatDialog) { }


  ngOnInit(): void {

    //Get the user and user profile info from localstorage
    this.user = JSON.parse(<string>localStorage.getItem('user'));
    this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));

    this.username = this.user.displayName;
    this.bio = this.profile.userInfo.bio;

    this.getUserNotebooks();
  }

  //Get the logged in user's notebooks
  getUserNotebooks(){

    this.notebookService.getUserNotebooks(this.user.uid)
      .subscribe(result => {

        let children = [{name: 'Notebook one', id: ''}];
        // for (let i = 0; i < result.length; i++) {
        //   children.push({name: result[i].course, id: result[i].notebookReference});
        // }

        this.dataSource.data = [{
          name: 'My notebooks',
          id: '',
          children: children
        }];

        // this.openTree();

      });
  }

  //Open the tree view
  openTree(){
      this.treeControl.expandAll();
  }

  //Toggle the sliding panel (open and close)
  openedCloseToggle(){

    const sideNav = document.getElementById('container') as HTMLElement;
    const col = sideNav?.parentElement?.parentElement;

    if(sideNav.style.width === '100%')
    {
      sideNav.style.width = '40px';

      if(col){
        col.style.width = 'fit-content';
        col.style.minWidth = '0px';
      }

    }
    else{
      sideNav.style.width = '100%';

      if(col){
        col.style.width = '16.6666666667%';
        col.style.minWidth = '250px';
      }
    }

  }

  //Used by notebook to open the notes panel
  openNotebookPanel(){}

  updateProfile(){

    //Open dialog
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '50%',
      data: {
        bio: this.bio,
        department: this.department,
        name: this.name,
        institution: this.institution,
        program: this.program,
        workstatus: this.workstatus
      }
    });

    //Get info and create notebook after dialog is closed
    dialogRef.afterClosed().subscribe(result => {

      //If the user filled out the form
      if (result !== undefined) {

        console.log(result);
      }
    });

  }
}


/**
 * Tree structure
 */
 interface DirectoryNode {
  name: string;
  id: string;
  children?: DirectoryNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  id: string;
  level: number;
}

