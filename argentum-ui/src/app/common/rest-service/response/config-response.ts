import { Config } from '../../model/config';
export class ConfigResponse {
  prepaid: boolean;
}

export function toConfig(response: ConfigResponse): Config {
  return {
    prepaid: response.prepaid
  };
}
