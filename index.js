import express from "express";
import statusMonitor from "express-status-monitor";
import fs from "node:fs";
import zlip from "node:zlib";

const app = express();

app.use(express.json());
app.use(statusMonitor());

app.get("/", (req, res) => {
  res.json({ message: "Hi from Index route" });
});

app.get("/send-file", (req, res) => {
  const file = fs.readFileSync("./video-1.htm", { encoding: "utf-8" });
  res.send(file);
});

// with streaming
app.get("/send-file-stream", (req, res) => {
  const stream = fs.createReadStream("./video-1.htm", { encoding: "utf-8" });
  stream.on("data", (chunk) => {
    res.write(chunk);
  });
  stream.on("end", () => {
    res.end(); // end response or close
  });
});

// convert into zip with streaming
app.get("/zip-stream", (req, res) => {
  // create read stream
  const stream = fs.createReadStream("./video-1.htm", { encoding: "utf-8" });
  stream.pipe(zlip.createGzip().pipe(fs.createWriteStream("./sample.zip")));
  res.send("Good");
});

app.listen(5000, () => {
  console.log("Server running at port");
});
