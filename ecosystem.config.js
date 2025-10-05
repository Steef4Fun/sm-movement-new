module.exports = {
  apps: [
    {
      name: 'sm-movement-app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      exec_mode: 'cluster',
      instances: 1,
    },
  ],
};