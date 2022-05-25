const express = require("express");
const logger = require("morgan");
const cors = require("cors");


const contactsRouter = require("./contacts/routes/api/contacts");
const { authRouter } = require("./auth/auth.controller");
const { userRouter } = require("./users/users.controller");
const upload = require("./middlewares/upload");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/static", express.static("public/avatars"))

app.use("/avatars",upload.single("avatar"), (req, res, next)=> {
  console.log('req.file', req.file)
res.send('OK')
})

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter)
app.use('/api/users', userRouter)

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
