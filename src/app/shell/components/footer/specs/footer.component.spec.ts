import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

// Load the implementations that should be tested
import { FooterComponent } from '../footer.component';

describe('Module Shell -> Component FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  // provide our implementations or mocks to the dependency injector
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [FooterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(FooterComponent);
      component = fixture.componentInstance;
    });

  }));

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

});
