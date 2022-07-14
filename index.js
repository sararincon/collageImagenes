const express = require("express");
const path = require("path");
const expFileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();

//Disponibilizando carpeta publica
app.use(express.static("public"));

//Parametros de configuracion
app.use(
  expFileUpload({
    limits: 500000,
    abortOnLimit: true,
    responseOnLimit: "EL archivo es demasiado grande",
  })
);

//Ruta de la pagina principal
app.get("/", (req, res) => {
  const location = path.resolve(__dirname, "./formulario.html");
  res.sendFile(location);
});

//Ruta GET /imagen para consumir el archivo "collage.html"
app.get("/collage", (req, res) => {
  const location = path.resolve(__dirname, "./collage.html");
  res.sendFile(location);
});

//Ruta POST para enviar la imagen a la ruta especificada extrayendo parametros del archivo y el body
app.post("/imagen", (req, res) => {
  const { target_file } = req.files;
  const { posicion } = req.body;
  const extension = target_file.name.split(".").pop();
  const location = path.resolve(
    __dirname,
    "./public/imgs/imagen-" + posicion + "." + extension
  );
  target_file.mv(location, (err) => err && res.status(500).send(err.message));

  res.redirect("/collage");
});

//ruta GET para eliminar la imagen de la carpeta publica
app.get("/deleteImg/:imagen", (req, res) => {
  const { imagen } = req.params;
  const location = path.resolve(__dirname, "./public/imgs/" + imagen);
  fs.unlink(location, (err) => {
    res.redirect("/collage");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
