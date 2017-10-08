//Account factory
skematikFactories.factory('AccountFactory', ["$resource", "$q", "$location", function($resource, $q, $location) {
    var account, host = $location.host();
    return {
        api: $resource('http://' + host + ':3000/account/:type', {type: "@type"}, {
            me: {
                method: 'GET',
                isArray: false,
                params:{
                    type:"me",
                }
            },
            login: {
                method: "POST",
                params: {
                    type: "login",
                }
            },
            logout: {
                method: "GET",
                params: {
                    type: "logout"
                }
            }
        }),
        setAccount : function(theAccount){
            account = theAccount;
        },
        getAccount : function(){
            // Fake account for now
            account =  {
                name: "Kaithlyn",
                img_url: "assets/images/profiles/kaithlyn.jpg"
            }
            return account;
        },
        isLoggedIn : function($scope){
            var deferred = $q.defer();

            //Return true or false
            /*
            if(typeof account == "undefined"){
                //Check online if account is logged in
                wrapper = this;

                this.api.me(function(data){
                    wrapper.setaccount(data.toJSON());
                    if(typeof wrapper.getAccount().account_id == "undefined"){
                        //No clue what came true (either nothing or a weird set), but the account has no ID, so he can't be logged in.
                        deferred.resolve(false);
                    }else{
                        //We should fire an event here, to make sure every view loads the account
                        $scope.$broadcast('account.login', {account: wrapper.getAccount()});
                        deferred.resolve(true);
                    }
                });
            }else{
                //$scope.$broadcast('accountIsLoggedIn', {account: this.getaccount()});
                deferred.resolve(true);
            }
            */
            deferred.resolve(false);
            return deferred.promise;
        },
        logOut : function($scope){
            wrapper = this;
            this.api.logout(function(data){
                if(data.message == "ok"){
                    wrapper.setAccount({});
                    $scope.$broadcast('account.logout', {redirect: data.redirect});
                }
            })
        }
    }
}]);