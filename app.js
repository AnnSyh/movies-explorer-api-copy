// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/routes');

const { PORT = 3000 } = process.env; // Слушаем 3000 порт

const app = express();

// функция обработки ошибок при подключении к серверу mongo
async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/bitfilmsdb');
  } catch (error) {
    console.log(error);
  }

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // Если всё работает, консоль покажет, какой порт приложение слушает
  });
}

// миддлвара
// app.use((req, res, next) => {
//   req.user = { // это _id созданного пользователя 'Тестовый пользователь'
//     _id: '62586a743a024449d70a1ecd',
//   };
//   next();
// });

// подключаем роуты и всё остальное...
app.use(express.json());
app.use(routes);

// запуск сервера
main();
