import { NotesPanelComponent } from './notes-panel/notes-panel.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-folder-panel',
  templateUrl: './folder-panel.component.html',
  styleUrls: ['./folder-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FolderPanelComponent implements OnInit {

  panelOpenState = false;
  width = 68.3;


  //-----------------  Code needed for the tree  ----------------------------------
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  //--------------------------------------------------------------------------------

  constructor(private panel: NotesPanelComponent) { }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.dataSource.data = TREE_DATA;
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

}


/**
 * Tree structure and data
 */
 interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Year 2',
    children: [
      {name: 'COS 214'},
      {name: 'COS 216'},
      {name: 'IMY 210'},
    ]
  }, {
    name: 'Year 3',
    children: [
      {
        name: 'Semester 1',
        children: [
          {name: 'COS 301'},
          {name: 'COS 332'},
        ]
      }, {
        name: 'Semester 2',
        children: [
          {name: 'COS 326'},
          {name: 'COS 314'},
        ]
      },
    ]
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

