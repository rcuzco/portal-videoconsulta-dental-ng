import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  NgModule,
  ApplicationRef,
  APP_INITIALIZER,
  ErrorHandler,
  Injector
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app.routes';

import { NoContentComponent } from './shared/components/no-content';

import { EnvironmentService } from './shared/services/environment';
import { ApiService, MultiLanguageService, TokenService, UtilsService } from './shared/services';
import { RestInterceptor } from './shared/services/rest/rest.interceptor';
import { ErrorHandlerInterceptor } from './shared/services/errorHandler/errorHandler.interceptor';
import { LoggerService } from './shared/services/logger/logger.service';

import { ShellMainComponent, ShellModule } from './shell';
import { LOCATION_INITIALIZED } from '@angular/common';
import { take, finalize } from 'rxjs/operators';
import { PropertiesService } from './shared/services/properties/properties.service';


/* AOT configuration */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/* to load config */
export function initConfig(config: EnvironmentService) {
  return () => config.loadConfig();
}

/* to load config */
export function initProps(props: PropertiesService) {
  return () => props.loadProps();
}


export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {

    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const langToSet = 'es';
      translate.setDefaultLang(langToSet);

      translate.use(langToSet).
        pipe(
          take(1),
          finalize(() => resolve(null))
        )
        .subscribe();
    });
  });
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ShellMainComponent],
  declarations: [
    NoContentComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    ShellModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RestInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [EnvironmentService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initProps,
      deps: [PropertiesService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerInterceptor
    }
  ]
})
export class AppModule {

}
