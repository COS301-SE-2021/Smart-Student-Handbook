import { NotesPanelComponent } from './notes-panel/notes-panel.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatTree, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { ViewEncapsulation } from '@angular/core';
import {NotebookService} from "../../services/notebook.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-folder-panel',
  templateUrl: './folder-panel.component.html',
  styleUrls: ['./folder-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FolderPanelComponent implements OnInit {

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
              private router: Router) { }

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

