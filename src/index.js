const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
app.use(express.urlencoded());
const initialData = require("./InitialData");
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here
let num = initialData.length + 1;
app.get("/api/student", async (req, res) => {
  try {
    res.json({
      status: "success",
      initialData,
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      message: e.message,
    });
  }
});
app.get("/api/student/:id", async (req, res) => {
  try {
    const student = await initialData.findIndex(
      (obj) => obj.id == req.params.id
    );
    if (student == -1) {
      return res.status(404).json({
        status: "failed",
        message: "There is no student with given ID",
      });
    }
    res.json({
      status: "success",
      result: initialData[student],
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      message: e.message,
    });
  }
});
app.post("/api/student", async (req, res) => {
  try {
    if (!req.body.name || !req.body.currentClass || !req.body.division) {
      return res.status(400).json({
        status: "failed",
        message: "Incomplete data",
      });
    }
    initialData.push({
      id: num,
      name: req.body.name,
      currentClass: req.body.currentClass,
      division: req.body.division,
    });
    res.json({
      status: "success",
      id: num,
    });
    num++;
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
});
app.put("/api/student/:id", async (req, res) => {
  try {
    const student = await initialData.findIndex(
      (obj) => obj.id == req.params.id
    );
    if (student == -1) {
      return res.status(400).json({
        status: "failed",
        message: "There is no student with the given ID",
      });
    }
    if (req.body.name) initialData[student].name = req.body.name;

    if (req.body.currentClass)
      initialData[student].currentClass = req.body.currentClass;

    if (req.body.division) initialData[student].division = req.body.division;
    res.json({
      status: "success",
      result: initialData[student],
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
});
app.delete("/api/student/:id", async (req, res) => {
  try {
    const student = await initialData.findIndex(
      (obj) => obj.id == req.params.id
    );
    if (student == -1) {
      return res.status(400).json({
        status: "failed",
        message: "There is no student with the given ID",
      });
    }
    initialData.splice(student, 1);
    res.json({
      status: "success",
      result: "Data deleted",
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      message: e.message,
    });
  }
});
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
