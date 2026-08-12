import 'dotenv/config';
import { app } from './app';

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(`Server listening on port ${port}`);
});
