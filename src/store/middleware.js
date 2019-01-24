import { push } from 'connected-react-router';

export default store => next => action => {
  if (action.pushQueryParams) {
    const paramsObj = new URLSearchParams(window.location.search)
    Object.keys(action.pushQueryParams).forEach(param => {
      paramsObj.set(param, action.pushQueryParams[param]);
    });

    store.dispatch(push({
        pathname: window.location.pathname,
        search: paramsObj.toString()
      })
    );
  }

  return next(action);
}