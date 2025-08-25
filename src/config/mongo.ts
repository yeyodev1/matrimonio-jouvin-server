// src/config/mongo.ts

import mongoose from "mongoose";

// Declaramos una variable global para cachear la conexión
const MONGODB_URI = 'mongodb+srv://dreyes:mA8YM7R02XuUr0MQ@matrimonio-jouvin.fvvpnlx.mongodb.net/?retryWrites=true&w=majority&appName=matrimonio-jouvin';

if (!MONGODB_URI) {
  throw new Error(
    "Please define the DB_URI environment variable inside .env.local"
    
  );
}

// En desarrollo, el 'hot-reloading' puede crear múltiples conexiones. 
// Usamos una variable global para evitarlo.
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // Si ya tenemos una conexión en caché, la usamos.
    console.log("✅ Using cached database connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    // Si no hay una promesa de conexión, creamos una nueva.
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("🚀 New database connection established.");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;