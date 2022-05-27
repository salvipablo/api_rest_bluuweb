import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.URI_MONGO)
  console.log('Connected to the DB');
} catch (error) {
  console.log(`Database connection error: ${error}`);
}