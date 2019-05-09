import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-auth',
  template: ''
})
export class AuthComponent {
  private sessionStorageItems = {
    access_token: '',
    granted_scopes: ["https://vwt-d-gew1-snb-planning-api/snbplanningapi.read"],
    access_token_stored_at: new Date().getTime(),
    expires_at: new Date().getTime(),
    id_token: '',
    id_token_claims_obj: {},
    id_token_expires_at: new Date().getTime(),
    id_token_stored_at: new Date().getTime()
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oauthService: OAuthService
  ){
    const helper = new JwtHelperService();
    var isAuthorised: boolean = false;

    this.route.paramMap.subscribe(params => {
      if(params.get('authBody') != ''){
        var authBody = JSON.parse(params.get('authBody'));

        if(authBody['access_token'] && authBody['expires_in']){
          var accessToken = authBody['access_token'],
            expiresIn = authBody['expires_in'];

          // SAVE ACCESS TOKEN
          var decodedToken = helper.decodeToken(accessToken);
          this.sessionStorageItems.id_token_claims_obj = decodedToken;
          this.sessionStorageItems.id_token_claims_obj['roles'] = ["snbplanningapi.editor"];
          this.sessionStorageItems.id_token_claims_obj['email'] = "opensource@vwt.digital";
          this.sessionStorageItems.access_token = accessToken;
          this.sessionStorageItems.id_token = accessToken;


          // SET EXPIRATION TIME
          var expiresAt = (expiresIn.toString().length <= 6 ? expiresIn * 1000 : expiresIn);
          this.sessionStorageItems.expires_at = this.sessionStorageItems.expires_at + expiresAt;
          this.sessionStorageItems.id_token_expires_at = this.sessionStorageItems.id_token_expires_at + expiresAt;

          // SAVE TO SESSION STORAGE
          for (let key in this.sessionStorageItems) {
            var value = (typeof this.sessionStorageItems[key] == 'string' ? this.sessionStorageItems[key] : JSON.stringify(this.sessionStorageItems[key]));
            sessionStorage.setItem(key, value);
          }

          // CHECK IF ACCESS TOKEN IS VALID
          if(this.oauthService.hasValidAccessToken()){
            isAuthorised = true;
          }
        }
      }

      if(isAuthorised){
        this.router.navigate(['/']);
      } else{
        this.oauthService.initImplicitFlow();
      }
    });
  }
}
