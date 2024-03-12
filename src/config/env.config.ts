export const EnvConfig = () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
})