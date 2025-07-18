import dotenv from 'dotenv';
import {app} from "./app.js";

dotenv.config({
    path: './.env',
})

import connectDB from './db/index.js';

await connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});