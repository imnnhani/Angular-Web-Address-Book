import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxButtonModule } from 'devextreme-angular/ui/button';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [AppComponent, ListComponent, ModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxPopupModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
