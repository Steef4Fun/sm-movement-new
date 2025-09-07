module.exports = {
  apps: [
    {
      name: 'sm-movement-frontend',      // De naam van je applicatie in PM2
      script: 'node_modules/next/dist/bin/next', // Het directe pad naar de 'next' executable
      args: 'start -p 3001',            // De argumenten die we meegeven (start op poort 3001)
      exec_mode: 'cluster',             // Stabielere modus
      instances: 1,                     // Draai 1 instantie
      // cwd is niet nodig, PM2 gebruikt de map van het config bestand
    },
  ],
};