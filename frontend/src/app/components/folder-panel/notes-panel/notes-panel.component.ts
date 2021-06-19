import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {NotebookService} from "../../../services/notebook.service";

@Component({
  selector: 'app-notes-panel',
  templateUrl: './notes-panel.component.html',
  styleUrls: ['./notes-panel.component.scss']
})

@Injectable()
export class NotesPanelComponent implements OnInit {

  public closeNotePanelBtn: any;

  open = false;

  public notebooks: any = [];

  constructor(private notebookService: NotebookService) { }

  async ngOnInit() {

    this.notebookService.getUserNotebooks('zsm6CotjuAVMUynICGD5QCiQNGl2')
      .subscribe(result => {
        // console.log(result);

        for(let i = 0; i < result.length; i++){
          this.notebooks.push(result[i]);
        }
      });
  }



//   public setSidenav(sidenav: MatSidenav) {
//     this.sidenav = sidenav;
// }

// public open() {
//     return this.sidenav.open();
// }


// public close() {
//     return this.sidenav.close();
// }

  public openedCloseToggle(){

    // @ViewChild('sidenav') sidenav: any;

    // console.log(sidenav);

    this.open = true;

    console.log(this.open);

    const sideNavContainer = document.getElementById('notes-container') as HTMLElement;
    const col = sideNavContainer?.parentElement?.parentElement;

    if(sideNavContainer.style.width === '100%')
    {
      sideNavContainer.style.width = '40px';

      if(col){
        col.style.width = 'fit-content';
      }

    }
    else{
      sideNavContainer.style.width = '100%';

      if(col){
        col.style.width = '16.6666666667%';
      }
    }

  }

}
