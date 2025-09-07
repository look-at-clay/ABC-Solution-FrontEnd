export interface Configuration {
  id: number;
  configKey: string;
  configDescription: string;
  configValue: string;
}

export interface ConfigurationUpdateRequest {
  configKey: string;
  configDescription: string;
  configValue: string;
}