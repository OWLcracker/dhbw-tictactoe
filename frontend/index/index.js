window.addEventListener("load", () => {

    let parser = new DOMParser();
   let  swapContent = async (id, title) =>  {

       //Load relevant HTML
       let response = await fetch(".." + id + ".html");
       let htmlString = await response.text();
       let newDoc = parser.parseFromString(htmlString, 'text/html');

       let scriptOld = document.getElementById("script");
       scriptOld.remove();

       //Replace Main of the original HTML
       let mainOld = document.getElementById("main");
       mainOld.id = "mainOld";
       let mainNew = newDoc.getElementById("main");
       mainNew.style.display = "none";
       document.body.appendChild(mainNew);

       //Replace Stylesheet
       let styleOld = document.getElementById("style");
       styleOld.id = "styleOld";
       let styleNew = document.createElement("link");
       styleNew.setAttribute("rel","stylesheet");
       styleNew.setAttribute("id","style");
       styleNew.setAttribute("href", ".." + id + ".css");
       document.head.appendChild(styleNew);


       //Replace Scripts of the original HTML
       let script = document.createElement("script");
       script.setAttribute("id", "script");
       response = await fetch( ".." + id + ".js");
       let scriptString = await response.text();
       script.innerHTML = scriptString;

       //Wait until the end to remove old style and make new main element visible
       //to ensure a smooth transition
       mainOld.remove();
       styleOld.remove();
       mainNew.style.display = "block";
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
            url: "^/profile/$",
            show: () => swapContent("/profile/profile", "Profile"),
        },{
            url: "^/history/$",
            show: () => swapContent("/history/history", "History"),
        },{
            url: ".*",
            //TODO:404 Seite
        }
    ];

    let router = new Router(routes);
    router.start();
});



