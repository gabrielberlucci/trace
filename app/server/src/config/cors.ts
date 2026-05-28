export const corsOptions = {
  origin: process.env.FRONT_END_ORIGIN,
  methods: ['GET', 'PATCH', 'POST'],
  optionsSuccessStatus: 200,
};
