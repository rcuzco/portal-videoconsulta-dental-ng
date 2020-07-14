import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { MultiLanguageService } from '../../../shared/services/multiLanguage';

@Component({
  selector: 'sas-shell',
  styleUrls: ['./shell-main.component.scss'],
  templateUrl: './shell-main.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ShellMainComponent implements OnInit {

  constructor(
    private translate: MultiLanguageService) {

  }
  public ngOnInit() {
    // initialize translate service
    this.translate.initialize();
  }

}
