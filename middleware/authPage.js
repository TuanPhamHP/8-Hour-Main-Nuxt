import { getCookie } from '@/helpers/customizeCookie.js';
const auth = ({ redirect, route, store }) => {
  const cacheCToken = getCookie('token');
  const cacheLToken = localStorage.getItem('token');
  const authUser = store.state.auth;
  console.log(authUser);
  if (route.path === '/login') {
    return;
  }
  console.log(redirect);
  if (!cacheCToken && !cacheLToken) {
    redirect('/login');
    return false;
  }

  return true;
};
export default auth;
