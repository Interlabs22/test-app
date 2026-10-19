const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// КРИТИЧЕСКИЙ НАСТРОЙКА ДЛЯ DOCKER:
// Заставляем Metro использовать встроенный Node-метод слежения за файлами
// вместо системного watchman/inotify, который слепнет внутри контейнера.
config.watcher = {
  ...config.watcher,
  watchman: false,
  node: true,
};

module.exports = config;