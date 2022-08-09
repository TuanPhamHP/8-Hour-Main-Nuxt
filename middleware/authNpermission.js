export default function ({ route, store, redirect }) {
  console.log(route);
  if (route.path === '/login') {
    return;
  }
  // If the user is not authenticated
  if (!store.state.userChat || !store.state.userChat.authToken) {
    return redirect('/login');
  }
}
