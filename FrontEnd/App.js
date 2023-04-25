
let app = {
    URL_API_Base : "http://localhost:5678/api",
    Gallery : document.querySelector('.gallery'),
    "init" : () => {

        console.log('...');
        app.clearGallery();
        app.getWorks();
    },
    "getWorks" : () => {
        const URL = "/works";
        const Method = "GET";
        app.fetchAPI(URL, Method).then(res =>{

            res.forEach(Work => {
                let FigureElm = document.createElement("figure");
                let ImgElm = document.createElement("img");
                let FigCaptionElm = document.createElement("figcaption");

                ImgElm.alt = Work.title;
                ImgElm.src = Work.imageUrl;

                FigCaptionElm.innerHTML = Work.title;

                FigureElm.appendChild(ImgElm);
                FigureElm.appendChild(FigCaptionElm);

                app.Gallery.appendChild(FigureElm);

            })
        })
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

