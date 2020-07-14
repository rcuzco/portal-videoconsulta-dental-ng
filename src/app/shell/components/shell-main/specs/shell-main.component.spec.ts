import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MultiLanguageService } from '../../../../shared/services/multiLanguage';
// Load the implementations that should be tested
import { ShellMainComponent } from '../shell-main.component';
import { routes } from '../../../shell.routes';
import { HeaderComponent, FooterComponent } from '../../';
describe('Module Shell -> Component ShellMainComponent', () => {

  let component: ShellMainComponent;
  let fixture: ComponentFixture<ShellMainComponent>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        RouterTestingModule
      ],
      providers: [MultiLanguageService],
      declarations: [ShellMainComponent, HeaderComponent, FooterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ShellMainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  }));

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

});
