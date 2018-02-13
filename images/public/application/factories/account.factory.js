//Account factory
skematikFactories.factory('AccountFactory', ["$resource", "$q", "$location", "$rootScope", function($resource, $q, $location, $rootScope) {
    var account, host = $location.host();
    return {
        api: $resource('http://' + host + ':3000/:type', {type: "@type"}, {
            me: {
                method: 'GET',
                isArray: false,
                params:{
                    type:"me",
                    path: $location.path()
                }
            },
            login: {
                method: "POST",
                params: {
                    type: "login",
                },
                skipAuthorization: true
            },
            logout: {
                method: "POST",
                params: {
                    type: "logout"
                }
            },
            register: {
                method: "POST",
                params: {
                    type: "register"
                }
            }
        }),
        setAccount : function(theAccount){
            account = theAccount;
        },
        getAccount : function(){
            var deferred = $q.defer(), wrapper = this;

            //Return true or false
            if(typeof account == "undefined"){
                //Check online if account is logged in
                wrapper = this;

                this.api.me(function(data){
                    if(typeof data.mail == "undefined"){
                        //No clue what came true (either nothing or a weird set), but the account has no mail, so he can't be logged in.
                        deferred.resolve(false);
                        $rootScope.isAuthenticated = false;
                    }else{
                        wrapper.setAccount(data.toJSON());
                        deferred.resolve(account);
                        $rootScope.isAuthenticated = true;
                    }
                });
            }else{
                deferred.resolve(account);
                $rootScope.isAuthenticated = true;
            }

            return deferred.promise;
        },
        login: function(account){
            var deferred = $q.defer(), wrapper = this;

            this.api.login(account, function(data){
                if(data.$status == 200){
                    //Save jwt-token in local storage
                    localStorage.setItem("jwt-token", data.token);
                    wrapper.setAccount(account);
                    $rootScope.$broadcast('account.login', {account: wrapper.getAccount()});
                    $rootScope.isAuthenticated = true;
                }

                //Component has no use for the response, unless it's an error
                deferred.resolve(data);
            }, function(error){
                console.log(error);
                deferred.resolve(false);
            });

            return deferred.promise;
        },
        isLoggedIn : function(){
            if(!$rootScope.isAuthenticated){
                this.getAccount().then(function(account){
                    if(account.username === undefined){
                        $rootScope.isAuthenticated = false;
                        return false;
                    }else{
                        $rootScope.isAuthenticated = true;
                        return true;
                    }
                });
            }else{
                return true;
            }
        },
        logout : function(){
            localStorage.removeItem("jwt-token");
            $rootScope.isAuthenticated = false;

            wrapper = this;
            this.api.logout(function(data){
                if(data.message == "ok"){
                    wrapper.setAccount({});
                    $rootScope.$broadcast('account.logout');
                }
            })
        }
    }
}]);