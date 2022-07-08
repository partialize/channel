interface Config extends Record<string, unknown> {
  port?: number;
  age: number;

  redis?: {
    url: string;
  };
}

export default Config;
