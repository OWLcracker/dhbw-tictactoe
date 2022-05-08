"use strict";
class Router {

    constructor(routes) {
        this._routes = routes;
        this._started = false;


        window.addEventListener("hashchange", () => this._handleRouting());
    }

    start() {
        this._started = true;
        this._handleRouting();
    }
    stop() {
        this._started = false;
    }
    _handleRouting() {
        let url = location.hash.slice(1);

        if (url.length === 0) {
            url = "/";
        }
        if(!this.checkAuthentication() && url !== "/login/" && url !=="/register/"){
            location.href = "#/login/";
            return;
        }

        let matches = null;
        let route = this._routes.find(p => matches = url.match(p.url));

        if (!route) {
            console.error(`Keine Route zur URL ${url} gefunden!`);
            return;
        }

        route.show(matches);
    }
    checkAuthentication(){
        console.log(document.cookie);
        if(getCookieValue("id") === "" ){//|| user.session_creationDate + 1000 * 60 * 60 * 24  < Date.now()
            return false;
        }
        else {
            user.id = getCookieValue("id");
            user.session_key = getCookieValue("session_key");
            return true;
        }
    }
}
