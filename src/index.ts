// src/index.ts

import * as dotenv from "dotenv";
import createApp from "./app";

// Carga las variables de entorno
dotenv.config();

// Obtenemos la aplicación de Express
const { app } = createApp();

// Exportamos la 'app'. Esto es lo que Vercel ejecutará.
export default app;