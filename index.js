const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello from GKE!'));

app.listen(port, () => console.log(`hello-gke listening at http://localhost:${port}`));
