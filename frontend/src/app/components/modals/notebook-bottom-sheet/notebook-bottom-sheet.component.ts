import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

export interface Tag {
  name: string;
}

@Component({
  selector: 'app-notebook-bottom-sheet',
  templateUrl: './notebook-bottom-sheet.component.html',
  styleUrls: ['./notebook-bottom-sheet.component.scss']
})
export class NotebookBottomSheetComponent implements OnInit {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tag[] = [
    {name: 'tag1'},
    {name: 'tag2'},
    {name: 'tag3'},
    {name: 'tag4'}
  ];

  constructor(private bottomSheetRef: MatBottomSheetRef<NotebookBottomSheetComponent>) { }

  ngOnInit(): void {
  }

  /**
   * Insert new tags to the input and tags array
   * @param event To get the value from the newly inserted tag
   */
   addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  /**
   * Remove a tag from input and tags array
   * @param tag the tag to be removed
   */
  removeTag(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  closeSheet(event: MouseEvent): void{
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
