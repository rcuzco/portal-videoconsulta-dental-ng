import { Routes } from '@angular/router';
import { NoContentComponent } from './shared/components/no-content';

import { ROUTES_CONSTANTS } from '../app/shared/constants/routes/routes.constants';

export const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/+videoconference/videoconference.module').then(m => m.VideoConferenceModule)
  },
  { path: '**', component: NoContentComponent }
];
