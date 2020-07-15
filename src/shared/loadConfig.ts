import * as envalid from 'envalid';
import { ValidatorSpec } from 'envalid';

export { bool, num, str, url, json, host, port, email } from 'envalid';

interface ConfigVar<T = any> {
  env: string;
  type: T;
}

interface ConstantVar<T = any> {
  value: T;
}

interface ConfigMap {
  [key: string]: ConfigVar | ConstantVar | ConfigMap;
  [key: number]: never;
}

type ConfigType<T extends ConfigMap> = {
  [P in keyof T]: T[P] extends ConfigMap
    ? ConfigType<T[P]>
    : T[P] extends ConstantVar<infer X>
    ? X
    : T[P] extends ConfigVar<ValidatorSpec<infer Y>>
    ? Y
    : never;
};

function isConfigVar(value: any): value is ConfigVar {
  return typeof value.env === 'string' && value.type;
}

function isConstantVar(value: any): value is ConstantVar {
  const keys = Object.keys(value);
  return keys.includes('value') && keys.length === 1;
}

function isConfigMap(value: any): value is ConfigMap {
  return !isConfigVar(value) && !isConstantVar(value);
}

export function parseConfig<T extends ConfigMap>(
  configMap: T,
): () => ConfigType<T> {
  let cachedConfig: { [key: string]: any }; // cache config
  return () => {
    if (!cachedConfig) {
      const config: { [key: string]: any } = {};

      const envMap: { [key: string]: ValidatorSpec<any> } = {};
      const keyToEnv: { [key: string]: string } = {};

      Object.keys(configMap).forEach(key => {
        const configVar = configMap[key];
        if (isConfigVar(configVar)) {
          envMap[configVar.env] = configVar.type;
          keyToEnv[key] = configVar.env;
        } else if (isConstantVar(configVar)) {
          config[key] = configVar.value;
        } else if (isConfigMap(configVar)) {
          config[key] = parseConfig(configVar)();
        } else {
          throw Error(`Invalid config value at '${key}' = ${configVar}`);
        }
      });

      const secrets: any = JSON.parse(process.env.SECRETS || '{}');
      process.env = { ...secrets, ...process.env };

      const cleanEnv = envalid.cleanEnv(process.env, envMap, {
        dotEnvPath: '',
      });
      Object.keys(keyToEnv).forEach(
        key => (config[key] = cleanEnv[keyToEnv[key]]),
      );
      cachedConfig = config;
    }

    return cachedConfig as ConfigType<T>;
  };
}

export function loadConfig<T extends ConfigMap>(configMap: T): ConfigType<T> {
  return parseConfig(configMap)();
}
