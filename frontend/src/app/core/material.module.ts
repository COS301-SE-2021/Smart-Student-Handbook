// Simple module to bundle all the Angular Material imports as to reduce clutter in the app.module.ts

import { Injectable, NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import {MatAutocompleteModule} from '@angular/core/autocomplete';
// import {MatDatepickerModule} from '@angular/core/datepicker';
// import {MatFormFieldModule} from '@angular/core/form-field';
// import {MatRadioModule} from '@angular/core/radio';
// import {MatSelectModule} from '@angular/core/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
// import {MatListModule} from '@angular/core/list';
// import {MatGridListModule} from '@angular/core/grid-list';
import { MatCardModule } from '@angular/material/card';
// import {MatStepperModule} from '@angular/core/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import {MatProgressBarModule} from '@angular/core/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
// import {MatSnackBarModule} from '@angular/core/snack-bar';
// import {MatTableModule} from '@angular/core/table';
// import {MatSortModule} from '@angular/core/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTreeModule } from '@angular/material/tree';
import { MatCommonModule } from '@angular/material/core';

import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * NgModule that includes all Material modules. This helps you avoid importing core modules every time you
 * want to make use of one. this module should be injected into your app.module.ts file in order to work properly.
 */
@NgModule({
	exports: [
		// CDK
		LayoutModule,
		A11yModule,
		BidiModule,
		ObserversModule,
		OverlayModule,
		PlatformModule,
		PortalModule,
		CdkStepperModule,
		CdkTableModule,
		CdkTreeModule,
		DragDropModule,

		// Material
		MatListModule,
		MatTreeModule,
		MatCommonModule,
		MatCheckboxModule,
		// MatCheckboxModule,
		MatButtonModule,
		MatInputModule,
		// MatAutocompleteModule,
		// MatDatepickerModule,
		// MatFormFieldModule,
		// MatRadioModule,
		// MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatMenuModule,
		MatSidenavModule,
		MatToolbarModule,
		MatListModule,
		// MatGridListModule,
		MatCardModule,
		// MatStepperModule,
		MatTabsModule,
		MatExpansionModule,
		MatButtonToggleModule,
		MatChipsModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatDialogModule,
		MatTooltipModule,
		// MatSnackBarModule,
		// MatTableModule,
		// MatSortModule,
		MatPaginatorModule,
		MatBottomSheetModule,
		MatDividerModule,
	],
	declarations: [],
})
@Injectable({
	providedIn: 'root',
})
export class MaterialModule {}
