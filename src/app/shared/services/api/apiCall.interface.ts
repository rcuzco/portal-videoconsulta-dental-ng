import { ApiCallParams } from './apiCallParams.interface';

export interface ApiCallUrl {
  params: ApiCallParams;
  path: string;
}
