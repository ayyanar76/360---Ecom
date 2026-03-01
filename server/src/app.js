import express from "express";
import UserRoute from "./routes/UserRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import ProductRouter from "./routes/ProductRoute.js";
import OrderRouter from "./routes/OrderRoute.js";
import AiRouter from "./routes/AiRoute.js";
import StripeRoute from "./routes/stripeRoutes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigin = https://three60-shops.onrender.com/ || "http://localhost:5173";
app.use(cors({
  origin: allowedOrigin,
  credentials:true
}));
app.get("/", (req, res) => {
  res.json({
    msg: "Api is Working",
  });
});
app.use("/api/v1", UserRoute);
app.use("/api/v1", ProductRouter);
app.use("/api/v1", OrderRouter);
app.use("/api/v1", AiRouter);
app.use("/api/v1", StripeRoute);
export default app;
