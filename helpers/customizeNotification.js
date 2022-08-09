export const notifiUser = (title, message = '', expDays = 30) => {
  try {
    const options = {
      badge:
        'https://xc-service.maychudev.com/_nuxt/img/sidebar-logo.9eddcc1.svg',
      icon: 'https://xc-service.maychudev.com/_nuxt/img/sidebar-logo.9eddcc1.svg',
      image:
        'https://xc-service.maychudev.com/_nuxt/img/sidebar-logo.9eddcc1.svg',
      body: message
    };
    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
      // If it's okay let's create a notification
      // eslint-disable-next-line no-unused-vars
      const notification = new Notification(title, options);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          // eslint-disable-next-line no-unused-vars
          const notification = new Notification(title, options);
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  } catch (error) {
    console.error(
      'Error when try to show a notification via helper: notifiUser:',
      error
    );
  }
};
