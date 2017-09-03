import { Config } from '../../model/config';
export class ConfigResponse {
  postpaidLimit: number;
}

export function toConfig(response: ConfigResponse): Config {
  return {
    postpaidLimit: response.postpaidLimit
  };
}
