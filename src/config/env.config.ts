export const EnvConfig = () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,

    clientUrl: process.env.CLIENT_URL || 'http://localhost:4000',
    serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
})