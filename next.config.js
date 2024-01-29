const withTM = require('next-transpile-modules')([
   '@fullcalendar/core',
   '@babel/preset-react',
   '@fullcalendar/common',
   '@fullcalendar/daygrid',
   '@fullcalendar/interaction',
   '@fullcalendar/react',
   'react-select',
   'react-timezone-select',
])

module.exports = withTM({
   output: 'standalone',
   async redirects() {
      return [
         {
            source: '/',
            destination: '/imoon',
            permanent: false,
         },
      ]
   },
   webpack(config) {
      config.module.rules.push({
         test: /\.svg$/,
         use: [
            {
               loader: '@svgr/webpack',
               options: {
                  svgoConfig: {
                     plugins: [
                        {
                           name: 'removeViewBox',
                           active: false,
                        },
                     ],
                  },
               },
            },
         ],
      })

      return config
   },
   images: {
      domains: ['s2.coinmarketcap.com', 'cdn.imoon.com', 'alienrates.imoon.com'], // config image domains
   },
})
