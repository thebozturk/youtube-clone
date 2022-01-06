const express = require("express");
const config = require("./config");
const loaders = require("./loaders");
const UserRoutes = require("./routers/User");
const VideoRoutes = require("./routers/Video");
const cors = require("cors");
const app = express();

config();
loaders();

app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  app.use("/api/user", UserRoutes);
  app.use("/api/video", VideoRoutes);
});
