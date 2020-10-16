export class EnvService {
  // The values that are defined here are the default values that can
  // be overridden by env.js

  // Azure AD
  public loginUrl = '';
  public logoutUrl = '';
  public discoveryUrl = '';
  public clientId = '';
  public scope = '';
  public issuer = '';

  // API url
  public apiUrl = '';
  public ddmApiUrl = '';

  // ag-Grid enterprise key
  public agGridKey = '';

  // Whether or not to enable debug mode
  public enableDebug = true;

}
