module.exports = {
  apps: [
    {
      name: 'sm-movement-app', // Updated name for the unified app
      script: 'pnpm',
      args: 'start -p 3001',
      exec_mode: 'cluster',
      instances: 1,
    },
  ],
};