import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NotesPanelComponent } from './notes-panel.component';

describe('NotesPanelComponent', () => {
	let component: NotesPanelComponent;
	let fixture: ComponentFixture<NotesPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NotesPanelComponent],
			imports: [MatSidenavModule, BrowserAnimationsModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotesPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
