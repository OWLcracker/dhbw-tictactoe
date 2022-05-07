window.addEventListener("load", () => {

    let parser = new DOMParser();
   let  swapContent = async (id, title) =>  {

       //Load relevant HTML
       let response = await fetch(".." + id + ".html");
       let htmlString = await response.text();
       let newDoc = parser.parseFromString(htmlString, 'text/html');

       //Replace Main of the original HTML
       let main = document.getElementById("main");
       main.remove();
       main = newDoc.getElementById("main");
       document.body.appendChild(main);

       //Replace Stylesheet
       document.getElementById("style").href =".." + id + ".css";

       //Replace Scripts of the original HTML
       let script = document.getElementById("script");
       script.remove();
       script = document.createElement("script");
       script.setAttribute("id", "script");
       response = await fetch( ".." + id + ".js");
       let scriptString = await response.text();
       script.innerHTML = scriptString;
       document.body.appendChild(script);

       document.title = `${title}`;
    }

    let routes = [
        {
            url: "^/$",
            show: () => swapContent("/menu/menu", "Startseite"),
        },{
            url: "^/login/$",
            show: () => swapContent("/login/login", "Login"),
        },{
            url: "^/game/$",
            show: () => swapContent("/game/game", "Game"),
        },{
            url: "^/menu/$",
            show: () => swapContent("/menu/menu", "Menu"),
        },{
            url: "^/multiplayer/$",
            show: () => swapContent("/multiplayer/multiplayer", "Multiplayer"),
        },{
            url: "^/register/$",
            show: () => swapContent("/registration/registration", "Register"),
        },{
            url: ".*",
            show: () => swapContent("page-not-found", "Seite nicht gefunden"),
        }
    ];

    let router = new Router(routes);
    router.start();
});



