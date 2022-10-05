var dataservice = (function (){
   
  function Dataservice(){
    this.baseUrl = 'https://freddy.codesubmit.io';
  }

  /**
   * 
   * @param {string} uri 
   */
  Dataservice.prototype.sendRequest = async function(route) {
    //check if user acces_token has expired
    if(!authService.isAccessTokenValid()){
      // fetch refresh token
      await authService.refreshToken();
    }
    const { access: { token } } = localStorageHelper.getItem(USER_TOKEN);
    const response = await fetch(`${this.baseUrl}${route}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    return await response.json();
  }

  Dataservice.prototype.getDashboardData = async function(){
    const { dashboard } = await this.sendRequest('/dashboard');
    return dashboard;
  }

  Dataservice.prototype.getOrders = async function() {
    const orders = await this.sendRequest('/orders?page=20');
    console.log(orders);
  }

  return new Dataservice();
}());
