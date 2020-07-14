import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router } from '@angular/router';

import { MultiLanguageService } from '../shared/services';

import { ShellMainComponent } from './components/shell-main/shell-main.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { routes } from './shell.routes';

/**
 * Shell Module is common known as Application shell, this module isn't a lazy load module.
 * This module contains the main a minimum pieces of code of our application such a Toolbar,
 * Footer, etc... This allow us to load only the main content and avoid things that we don't need
 * at first load.
 */
@NgModule({
  declarations: [
    ShellMainComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  providers: [
    MultiLanguageService,
    TranslateService
  ]
})
export class ShellModule { }
