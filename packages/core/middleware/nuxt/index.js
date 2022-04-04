const { createServer } = require('@vue-storefront/middleware');
const helmet = require('helmet');
const consola = require('consola');

module.exports = function VueStorefrontMiddleware(moduleOptions) {
  const apiPath = 'api';

  const options = {
    crossOriginOpenerPolicy: false,
    permittedCrossDomainPolicies: {
      permittedPolicies: 'none'
    },
    contentSecurityPolicy: false,
    ...this.options.helmet || {},
    ...moduleOptions
  };

  this.nuxt.hook('render:setupMiddleware', (app) => {
    app.use(helmet(options));
    if (!options.silence) consola.success('Nuxt `Helmet` middleware added');
  });

  // Validating Server URL
  this.nuxt.hook('listen', (server, { url }) => {
    try {
      if (!url) consola.fatal('Nuxt was\'t able to fetch your url.');
      if (!(this.options && this.options.publicRuntimeConfig && this.options.publicRuntimeConfig.middlewareUrl)) {
        Object.assign(this.options.publicRuntimeConfig, {
          ...this.options.publicRuntimeConfig,
          middlewareUrl: new URL(apiPath, url).toString()
        });
        consola.success('Applied middlewareUrl as ', this.options.publicRuntimeConfig.middlewareUrl);
      }
    } catch (error) {
      consola.warn(error);
      consola.fatal('Nuxt wasn\'t able to fetch the middlewareUrl. Please follow the guide at https://docs.vuestorefront.io/v2/getting-started/configuration.html#nuxt-config-js to configure your nuxt.config.js');
    }
  });

  const { integrations } = require(this.nuxt.options.rootDir + '/middleware.config.js');

  const handler = createServer({ integrations });
  const serverMiddleware = { path: `/${apiPath}`, handler };

  this.addServerMiddleware(serverMiddleware);
};
