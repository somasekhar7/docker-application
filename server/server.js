const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/addition", (req, res) => {
  const { num1, num2 } = req.body;
  const result = num1 + num2;
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
