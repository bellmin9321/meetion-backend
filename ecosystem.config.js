module.exports = {
  apps: [
    {
      name: "Meetion",
      script: "concurrently -k -p \"[{name}]\" -n \"TypeScript,Node\" -c \"cyan.bold,green.bold\" \"npx tsc --watch\" \"nodemon ./src/bin/www\"",
      env: {
          NODE_ENV: "development"
      },
      env_production: {
          NODE_ENV: "production"
      }
    },
  ],
};