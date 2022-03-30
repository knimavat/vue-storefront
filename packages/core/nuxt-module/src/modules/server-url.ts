import consola from 'consola';

export default function VueStorefrontServerUrl(): void {
  const hasMiddlewareUrl = this.options?.publicRuntimeConfig?.middlewareUrl;

  if (!hasMiddlewareUrl) {
    this.nuxt.hook('listen', (server, { https, host, port }) => {
      try {
        const baseURL = new URL('', `http${https ? 's' : ''}://${host}:${port}`);

        this.options.publicRuntimeConfig = {
          ...this.options.publicRuntimeConfig,
          middlewareUrl: baseURL.origin
        };
      } catch (e) {
        consola.error(e);
        throw new Error('Nuxt wasn\'t able to fetch the middlewareUrl. Please follow the guide at https://docs.vuestorefront.io/v2/getting-started/configuration.html#nuxt-config-js to configure your nuxt.config.js');
      }
    });
  }
}
