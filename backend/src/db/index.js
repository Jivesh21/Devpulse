import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance =
      await mongoose.connect(
        process.env.MONGODB_URL
      );

    console.log(
      `\n✅ MongoDB connected`
    );

    console.log(
      `📦 Database: ${connectionInstance.connection.name}`
    );

    console.log(
      `🌐 Host: ${connectionInstance.connection.host}`
    );

    console.log(
      `📚 Collections:`,
      Object.keys(
        connectionInstance.connection.collections
      )
    );
  } catch (error) {
    console.log(
      "Mongo DB connection error:",
      error
    );

    process.exit(1);
  }
};

export default connectDB;