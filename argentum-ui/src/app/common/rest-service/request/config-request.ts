import { Config } from '../../model/config';
export class ConfigRequest {
  postpaidLimit: number;
}

export function fromConfig(config: Config): ConfigRequest {
  return {
    postpaidLimit: config.postpaidLimit
  };
}
