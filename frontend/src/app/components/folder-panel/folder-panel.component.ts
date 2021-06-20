import { NotesPanelComponent } from './notes-panel/notes-panel.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatTree, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { ViewEncapsulation } from '@angular/core';
import {NotebookService} from "../../services/notebook.service";
import {Router} from "@angular/router";
import {EditProfileComponent} from "../../notebook/edit-profile/edit-profile.component";
import {MatDialog} from "@angular/material/dialog";
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-folder-panel',
  templateUrl: './folder-panel.component.html',
  styleUrls: ['./folder-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FolderPanelComponent implements OnInit {

  username: string = '';
  bio: string = '';
  institution: string = '';
  department: string = '';
  name: string = '';
  program: string = '';
  workstatus: string = '';

  // @ViewChild('tree') tree!: MatTree<any>;
  open: boolean = false;

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

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  //--------------------------------------------------------------------------------

  constructor(private panel: NotesPanelComponent, private notebookService: NotebookService,
              private router: Router, private dialog: MatDialog, private profileService: ProfileService) { }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {

    this.getUserNotebooks();

  }

  getUserNotebooks(){

    this.notebookService.getUserNotebooks('zsm6CotjuAVMUynICGD5QCiQNGl2')
      .subscribe(result => {
        console.log(result);

        let children = [];
        for (let i = 0; i < result.length; i++) {
          children.push({name: result[i].course, id: result[i].notebookReference});
        }

        this.dataSource.data = [{
          name: 'Notebooks',
          id: '',
          children: children
        }];

        this.openTree();

      });
  }

  openTree(){

    // if(this.open)
      this.treeControl.expandAll();

    // this.open = false;

    // console.log(this.treeControl.dataNodes[0].);
  }

  openedCloseToggle(){
    const sideNav = document.getElementById('container') as HTMLElement;
    const col = sideNav?.parentElement?.parentElement;

    if(sideNav.style.width === '100%')
    {
      sideNav.style.width = '40px';

      if(col){
        col.style.width = 'fit-content';
      }

    }
    else{
      sideNav.style.width = '100%';

      if(col){
        col.style.width = '16.6666666667%';
      }
    }

  }

  folderSelected(item: string){

    if(item === 'COS 301'){
      this.panel.openedCloseToggle();
    }
  }

  openNotebook(item: any){
    // console.log(item.id);

    this.router.navigate(['notebook'], {queryParams: {id: item.id}});
  }

  updateProfile(){

    let user = JSON.parse(<string>localStorage.getItem('user'));

    this.profileService.getUserDetails(user.uid).subscribe(data => {

       //Open dialog
        const dialogRef = this.dialog.open(EditProfileComponent, {
          width: '50%',
          data: {
            bio: data.userInfo.bio,
            department: data.userInfo.department,
            name: data.userInfo.name,
            institution: data.userInfo.institution,
            program: data.userInfo.program,
            workstatus: data.userInfo.workStatus
          }
        });

        //Get info and create notebook after dialog is closed
        dialogRef.afterClosed().subscribe(result => {

          this.profileService.updateUser(user.uid, result.name, result.institution, result.department, result.program, result.workstatus, result.bio).subscribe(data => {
            },
            err => {
              console.log("Error: "+err.error.message);
            }
          );

        });

      },
      err => {
        console.log("Error: "+err.error.message);
      }
    );

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

