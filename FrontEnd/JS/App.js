
let app = {
    URL_API_Base : "http://localhost:5678/api",
    FilterItems : document.querySelectorAll('.FilterItem'),
    Gallery : document.querySelector('.gallery'),
    Projects : [],
    "init" : () => {

        app.FilterItems.forEach(FilterItem => {
            FilterItem.addEventListener( 'click', app.FilterProject);
        });

        app.clearGallery();
        app.getWorks();
    },
    "FilterProject" : (e) => {
        const CurrentFilter = e.currentTarget;
        const CurrentCategory = CurrentFilter.innerText
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");

        app.FilterItems.forEach(FilterItem => {
            FilterItem.className = "FilterItem";
            CurrentFilter.className = "FilterItem CurrentFilter";
        });

        app.clearGallery();

        if(CurrentCategory !== "Tous")
        {
            app.Projects.filter(item =>
                item.category.name === CurrentCategory)
                .forEach(Project => app.createElmProjects(Project));
        }
        else
        {
            app.Projects.forEach(Project => app.createElmProjects(Project) );
        }
    },
    "getWorks" : () => {
        const URL = "/works";
        const Method = "GET";
        app.fetchAPI(URL, Method).then(res =>{
            res.forEach(Project => {
                app.createElmProjects(Project);
                app.Projects.push(Project);
            });
        })
    },
    "createElmProjects" : (Project) => {
            let FigureElm = document.createElement("figure");
            let ImgElm = document.createElement("img");
            let FigCaptionElm = document.createElement("figcaption");

            ImgElm.alt = Project.title;
            ImgElm.src = Project.imageUrl;

            FigCaptionElm.innerHTML = Project.title;

            FigureElm.appendChild(ImgElm);
            FigureElm.appendChild(FigCaptionElm);

            app.Gallery.appendChild(FigureElm);
    },
    "clearGallery" : () => {
        app.Gallery.innerHTML = '';
    },
    "fetchAPI" : (URL, Method, Data = null, Token = null) => {

        const CurrentURL = app.URL_API_Base+URL;
        const Body = JSON.stringify(Data);
        const Header = {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization': 'bearer '+Token
        }

        let initGET = {
            method : Method,
            headers : Header
        }
        let initPOST = {
            method : Method,
            headers : Header,
            body : Body,
            mode : 'cors'
        }

        let Init = initGET;
        if(Data !== null)
            Init = initPOST;

        return fetch(CurrentURL, Init)
            .then(res => res.json() )
            .then(res => {
                return res;
            })
    }
}


app.init();

