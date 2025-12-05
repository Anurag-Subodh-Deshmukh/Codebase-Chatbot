const connection = {
    host: 'game-puma-43289.upstash.io',
    port: 6379,
    password: process.env.UPSTASH_PASSWORD,
    tls: {}
  };
  
  export default connection;
  