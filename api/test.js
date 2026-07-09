import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/json", (req, res) => {
    res.json({message : "Hello World"});
});


app.listen(3006, () => {
    console.log('Server running on http://localhost:3006');
  });