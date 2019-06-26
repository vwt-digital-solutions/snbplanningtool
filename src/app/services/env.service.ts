export class EnvService {
  // The values that are defined here are the default values that can
  // be overridden by env.js

  // Azure AD
  public loginUrl = '';
  public logoutUrl = '';
  public clientId = '';
  public scope = '';
  public issuer = '';

  // API url
  public apiUrl = '';

  // Google Maps key
  public googleMapsKey = '';

  // ag-Grid enterprise key
  public agGridKey = '';

  // Whether or not to enable debug mode
  public enableDebug = true;

  constructor() { }

}
