import { EnvService } from './env.service';

export const EnvServiceFactory = (): EnvService => {
  // Create env
  const env = new EnvService();

  // Read environment variables from browser window
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  const browserWindow: any = window || {};
  const browserWindowEnv = browserWindow.__env || {};

  // Assign environment variables from browser window to env
  // In the current implementation, properties from env.js overwrite defaults from the EnvService.
  // If needed, a deep merge can be performed here to merge properties instead of overwriting them.
  for (const key in browserWindowEnv) {
    if (browserWindowEnv.hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
      env[key] = browserWindowEnv[key];
    }
  }

  return env;
};

export const EnvServiceProvider = {
  provide: EnvService,
  useFactory: EnvServiceFactory,
  deps: [],
};
