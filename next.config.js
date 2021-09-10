/* eslint-disable @typescript-eslint/no-var-requires */
// this can be disabled if you are doing dynamic imports without SSR
// const withTM = require('next-transpile-modules')(['@babylonjs/core', '@babylonjs/gui', 'babylonjs-hook'])
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withPlugins = require('next-compose-plugins')

/**
 * https://stackoverflow.com/questions/64847988/babylonjs-es6-in-nextjs-failes-with-unexpected-token-export/64847989
 */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de'
  },
  webpack: (config, { isServer }) => {
    // Fixes packages that depend on fs/module module
    if (!isServer) {
      config.node = { fs: 'empty', module: 'empty' }
    }

    /// below is not required for the problem described. Just for reference.(es6)
    config.module.rules.push({ test: /\.yml$/, use: 'raw-loader' })

    return config
  }
}

module.exports = withPlugins([withBundleAnalyzer /*, withTM*/], nextConfig)
