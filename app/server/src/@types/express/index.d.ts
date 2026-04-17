declare namespace Express {
  export interface Request {}
}

namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: string;
    BASE_URL: string;
    JWT_SECRET: string;
    LOG_LEVEL: string;
  }
}
