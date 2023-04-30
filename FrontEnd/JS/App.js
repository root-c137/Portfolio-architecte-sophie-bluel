
let app = {
    URL_API_Base : "http://localhost:5678/api",
    FilterItems : document.querySelectorAll('.FilterItem'),
    Gallery : document.querySelector('.gallery'),
    Projects : [],
    Categories : [],
    CurrentCategory : "Tous",
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



        app.clearGallery();
        app.getCategories();
        app.getWorks();
    },
    "editHandler" : () => {
        const ModalContainerElm = document.querySelector('.ModalContainer');
        const PhotosList = document.querySelector('.PhotosList');
        const CrossButton = document.querySelector('.Cross');

        CrossButton.addEventListener('click', app.removeModal);


        app.Projects.forEach(P => {
            const PhotoListItemElm = document.createElement('div');
            const PhotoListItemImg = document.createElement('img');
            const DelPhotoElm = document.createElement('button');
            const BEditElm = document.createElement('a');
            const ImgTrashElm = document.createElement('img');
            const BDeleteAllProject = document.querySelector('.BDelGallery');


            PhotoListItemElm.className = "PhotoList_Item";
            PhotoListItemImg.className = "PhotoList_Item_Img";
            BEditElm.className = "PhotoList_Item_BEdit";
            DelPhotoElm.className = "DelPhoto";
            ImgTrashElm.className = "Trash";

            PhotoListItemImg.src = P.imageUrl;
            ImgTrashElm.src = "assets/icons/Trash.svg";

            BEditElm.textContent = "éditer";

            DelPhotoElm.appendChild(ImgTrashElm);
            DelPhotoElm.addEventListener('click', app.removeProject);

            PhotoListItemElm.appendChild(PhotoListItemImg);
            PhotoListItemElm.appendChild(BEditElm);
            PhotoListItemElm.appendChild(DelPhotoElm);
            PhotoListItemElm.id = P.id;

            PhotosList.appendChild(PhotoListItemElm);

            BDeleteAllProject.addEventListener('click', app.removeAllProjects);


        });

        ModalContainerElm.style.display = "flex";
    },
    "removeAllProjects" : (e) => {
        e.preventDefault();

        app.Projects = [];
        app.clearGallery();
        app.FilterProject(app.CurrentCategory);
        document.querySelector('.PhotosList').innerHTML = '';
    },
    "removeModal" : () => {
        const ModalContainerElm = document.querySelector('.ModalContainer');
        const PhotosList = document.querySelector('.PhotosList');

        PhotosList.innerHTML = "";
        ModalContainerElm.style.display = "none";
    },
    "removeProject" : (e) => {


            let idCurrentElm = parseInt(e.currentTarget.parentElement.id);
            const NbProjects = app.Projects.childElementCount;

            console.log(idCurrentElm);
            e.currentTarget.parentElement.parentNode.removeChild(e.currentTarget.parentElement);
            app.Projects.forEach((P, index) => {
                if (P.id === idCurrentElm)
                    app.Projects.splice(index, 1);
            })



        app.clearGallery();
        app.FilterProject(app.CurrentCategory);

    },
    "FilterProject" : (CatName) => {

        console.log(CatName);
        document.querySelectorAll('.FilterItem').forEach(FilterItem => {
            FilterItem.className = "FilterItem";
            if(FilterItem.textContent === CatName)
            {
                FilterItem.className += " CurrentFilter";
            }
        });

        app.clearGallery();

        if(CatName !== "Tous")
        {
            app.Projects.filter(item =>
                item.category.name === CatName)
                .forEach(Project => app.createElmProjects(Project));
        }
        else
            app.Projects.forEach(Project => app.createElmProjects(Project) );

        app.CurrentCategory = CatName;
    },
    "getCategories" : () => {
        const URL = "/categories";
        const Method = "GET";
        const CatTous = {"id" : 0, "name" : "Tous"};

        app.createCategoriesElm(CatTous);

        app.fetchAPI(URL, Method).then(res => {
            res.forEach(Cat => {
                app.createCategoriesElm(Cat);
                app.Categories.push(Cat);
            });
        });
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
    "createCategoriesElm" : (Cat) => {
        const FilterMenuElm = document.querySelector('.FilterProjects_Menu');
        let LiElm = document.createElement('li');
        const LiClassName = "FilterItem";
        const LiClassName_CurrentFitler = "CurrentFilter";
        let CatName = Cat.name;

        if(Cat.name === "Hotels & restaurants")
            CatName = "Hôtels & restaurants";

        if(CatName === "Tous")
            LiElm.className = LiClassName+" "+LiClassName_CurrentFitler;
        else
        LiElm.className = LiClassName;

        LiElm.textContent = CatName;

        LiElm.addEventListener('click', () => (app.FilterProject(CatName) ));

        FilterMenuElm.appendChild(LiElm);
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

