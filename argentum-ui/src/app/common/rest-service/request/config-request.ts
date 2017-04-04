import { Config } from '../../model/config';
export class ConfigRequest {
  prepaid: boolean;
}

export function fromConfig(config: Config): ConfigRequest {
  return {
    prepaid: config.prepaid
  };
}
