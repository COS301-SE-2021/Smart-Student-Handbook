import { NotesPanelComponent } from './notes-panel/notes-panel.component'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FolderPanelComponent } from './folder-panel.component'

import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree'
import { FlatTreeControl } from '@angular/cdk/tree'
import { ViewEncapsulation } from '@angular/core'

describe('FolderPanelComponent', () => {
	let component: FolderPanelComponent
	let fixture: ComponentFixture<FolderPanelComponent>

	let notes = NotesPanelComponent

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FolderPanelComponent],
			imports: [],
			providers: [NotesPanelComponent],
		}).compileComponents()
	})

	beforeEach(() => {
		fixture = TestBed.createComponent(FolderPanelComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
