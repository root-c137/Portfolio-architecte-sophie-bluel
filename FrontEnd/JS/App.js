
let app = {
    URL_API_Base : "http://localhost:5678/api",
    FilterItems : document.querySelectorAll('.FilterItem'),
    Gallery : document.querySelector('.gallery'),
    Projects : [],
    isConnected : false,
    "init" : () => {

        if(localStorage.getItem('token') )
            app.isConnected = !app.isConnected;

        if(app.isConnected)
        {
            const TopBar = document.querySelector('.TopBar');
            const Header = document.getElementsByTagName("header")[0];
            const BEditGroup = document.querySelectorAll('.BEditGroup');
            const BEditProjects = document.querySelector('.BEditProjects');

            TopBar.style.display = "flex";
            Header.style.position = "relative";
            Header.style.paddingTop = "40px";

            BEditGroup.forEach(Elm => {
                Elm.style.display = "flex";
            });

            BEditProjects.addEventListener('click', app.editHandler);
            document.body.style.overflowX = "hidden";
        }

        app.FilterItems.forEach(FilterItem => {
            FilterItem.addEventListener( 'click', app.FilterProject);
        });

        app.clearGallery();
        app.getWorks();
    },
    "editHandler" : () => {
        console.log('edit..');
        const ModalContainerElm = document.querySelector('.ModalContainer');
        const PhotosList = document.querySelector('.PhotosList');
        const CrossButton = document.querySelector('.cross');

        CrossButton.addEventListener('click', app.removeModal);


        app.Projects.forEach(P => {
            console.log(P);
            const PhotoListItemElm = document.createElement('div');
            const PhotoListItemImg = document.createElement('img');
            const DelPhotoElm = document.createElement('button');
            const BEditElm = document.createElement('a');
            const ImgTrashElm = document.createElement('img');


            PhotoListItemElm.className = "PhotoList_Item";
            PhotoListItemImg.className = "PhotoList_Item_Img";
            BEditElm.className = "PhotoList_Item_BEdit";
            DelPhotoElm.className = "DelPhoto";
            ImgTrashElm.className = "Trash";

            PhotoListItemImg.src = P.imageUrl;
            ImgTrashElm.src = "assets/icons/Trash.svg";

            BEditElm.textContent = "éditer";

            DelPhotoElm.appendChild(ImgTrashElm);

            PhotoListItemElm.appendChild(PhotoListItemImg);
            PhotoListItemElm.appendChild(BEditElm);
            PhotoListItemElm.appendChild(DelPhotoElm);

            PhotosList.appendChild(PhotoListItemElm);
        });




        ModalContainerElm.style.display = "flex";
    },
    "removeModal" : () => {
        const ModalContainerElm = document.querySelector('.ModalContainer');
        ModalContainerElm.style.display = "none";
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

