
const proxy = require('http2-proxy')

module.exports = {
    mount: {
        'src/web/guest-templates/': { url: '/', resolve: true }
    },
    devOptions: {
        open: 'none'
    },
    buildOptions: {
        out: './public'
    },
    exclude: ['**/.idea/**'],
    plugins: [
        ['@snowpack/plugin-sass', { compilerOptions: { style: 'compressed' } }]
    ],
    optimize: {
        minify: true,
        target: 'es2018'
    },
    routes: [
        {
            src: '/guest',
            dest: (req, res) => {
                return proxy.web(req, res, {
                    hostname: 'localhost',
                    port: 4100
                })
            }
        }
    ]
}
