import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-smart-assist-panel',
  templateUrl: './smart-assist-panel.component.html',
  styleUrls: ['./smart-assist-panel.component.scss']
})
export class SmartAssistPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openedCloseToggle(){
    const sideNav = document.getElementById('smartAssistContainer') as HTMLElement;
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
        col.style.width = '25%';
      }
    }

  }
}
