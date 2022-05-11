import { object, string } from "yup";

const schema = object({
  VITE_API_URL: string().required(),
  VITE_WS_URL: string().required()
});

type ConfigKeys = keyof typeof schema.fields;

class Config {
  constructor() {
    this.validate();
  }

  get<T>(key: ConfigKeys) {
    return import.meta.env[key as unknown as string] as T;
  }

  async validate() {
    const env = import.meta.env;

    try {
      await schema.validate(env);
    } catch (e) {
      console.error("INVALID ENV VARIABLES", e);
    }
  }
}

export const config = new Config();
