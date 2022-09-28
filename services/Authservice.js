var AuthService = (function (){
    function authService(){
      this.token = "";
      this.isLoading = "";
    }

    authService.prototype.login = async function(username, password) {
      const response = await fetch('')
    }
    return authService;
}());
