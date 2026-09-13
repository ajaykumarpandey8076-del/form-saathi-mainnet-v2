useEffect(() => {
  const loadPi = async () => {
    try {
      const Pi = (await import('@pi-network/sdk')).default;
      Pi.init({ version: "2.0", sandbox: false });

      const scopes = ['username'];
      
      function onIncompletePaymentFound(payment) {
        console.log("Incomplete payment found", payment);
      }

      Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
        console.log("Logged in as: " + auth.user.username);
      }).catch(function(error) {
        console.error("Authentication error: ", error);
      });

    } catch (e) {
      console.error("Pi SDK Error", e);
    }
  };
  loadPi();
}, []);

