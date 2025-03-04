import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./config.env",
});

connectDB()
  .then(() => {
    console.log("MONGODB Connection success");
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB Connection fails", error);
    process.exit(1);
  });

// const app = express()(async () => {
//   try {
//     mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

//     app.on("Error", (error) => {
//       console.log("Error", error);
//       throw error;
//     });

//     app.listen(process.env.PORT,()=>{
//       console.log(`Server is running on port ${process.env.PORT}`);
//     })

//   } catch (error) {
//     console.error("Errors", error);
//     throw err;
//   }
// })();
