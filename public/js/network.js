(function (win) {
    function Network() {
        this.baseUrl = 'http://localhost:3000';
        this.contentType = "application/json; charset=utf-8";
        this.timeout = 90000;
    }

    Network.prototype.ajaxRequest = function (obj) {
        var //headers = obj.headers,
            baseUrl = this.baseUrl,
            url = obj.url,
            body = obj.data ? JSON.stringify(obj.data) : null,
            self = this;

        return $.ajax({
            type: obj.method,
            url: baseUrl + url,
            crossDomain: true,
            data: body,
            //headers: headers,
            contentType: this.contentType,
            dataType: "text",
            timeout: this.timeout,
            success: function (data, status, jqXHR) {
                var parsed = self.parseJSON(data);

                if (obj.hasOwnProperty("success") && typeof obj.success == 'function'){
                    obj.success(jqXHR.status, parsed);
                }
            },
            error: function (jqXHR, statusString, errorThrown) {
                console.log('Response Status: ' + jqXHR.status + ' ' + statusString);
                console.log('Response Error thrown: ' + errorThrown)

                if (obj.hasOwnProperty("error") && typeof obj.error == 'function') {
                    obj.error(jqXHR, statusString, errorThrown);
                }
            }
        });
    };

    Network.prototype.parseJSON = function (raw) {
        var response = (raw !== '') ? raw : '{}';
        try {
            response = JSON.parse(response);
        } catch (e) {
            console.error('Server Response is not JSON');
            console.error(e);
        }
        return response;
    };

    Network.prototype.getPage = function (page) {
        console.log(page);
        window.location = this.baseUrl + "/chat/home"
    };


    Network.prototype.logIn = function (data) {
        var obj = {
            method: 'POST',
            url: '/api/user/login',
            data: {
                username: data.user.username,
                password: data.user.password
            },
            success: data.onSuccess,
            error: data.onError
        };
        this.ajaxRequest(obj);
    };

    Network.prototype.createUser = function (data) {
        var obj = {
            method: 'POST',
            url: 'users',
            data: {
                username: data.user.username,
                password: data.user.password,
                email: data.user.email
            },
            success: data.onSuccess,
            error: data.onError
        };
        //this.headers['X-Parse-Revocable-Session'] = 1;
        this.ajaxRequest(obj);
    };

    win.network = new Network();
})(window);