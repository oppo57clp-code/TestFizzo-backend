const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server Aplikasi Novel Fizo Berjalan dengan Baik!');
});

app.listen(port, () => {
  console.log(`Server aktif di port ${port}`);
});
  
