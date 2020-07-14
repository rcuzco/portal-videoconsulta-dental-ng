import { Injectable } from '@angular/core';
/**
 * Environment Service takes constants defined in /config/app.config.json and
 * creates a service with values and make them accesible throught a angular 2 service
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  sasToken: string;

  private tokenName = 'SASTOKEN';
  constructor() {
    /* Block Empy */
  }

  getToken() {
    if (!this.sasToken) {
      this.setToken(this.getTokenFromStorage());
    }

    return this.sasToken;
  }

  setToken(token) {
    this.sasToken = token;
    sessionStorage.setItem(this.tokenName, (JSON.stringify(token)));
  }

  private getTokenFromStorage() {
    return JSON.parse(sessionStorage.getItem(this.tokenName));
  }

}
