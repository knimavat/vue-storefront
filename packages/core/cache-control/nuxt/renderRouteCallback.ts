import isUrlMatchingRule from './isUrlMatchingRule';
import { CacheControlModuleParams } from './types';

const renderRouteCallback = ({ default: defaultHeaderValue = 'max-age=60', matchRoute = {} }: CacheControlModuleParams) => (url, result, { res }): void => {
  res.setHeader('Cache-Control', defaultHeaderValue);

  Object.entries(matchRoute).map(([rule, headerValue]: [string, string]): void => {
    if (!isUrlMatchingRule(url, rule)) return;

    if (headerValue === 'none') {
      res.removeHeader('Cache-Control');
      return;
    }

    res.setHeader('Cache-Control', headerValue);
  });
};

export default renderRouteCallback;
