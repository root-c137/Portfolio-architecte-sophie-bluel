
let app = {
    URL_API_Base : "http://localhost:5678/api",
    FilterItems : document.querySelectorAll('.FilterItem'),
    Gallery : document.querySelector('.gallery'),
    FilterProjectcs : document.querySelector('.FilterProjects'),
    Projects : [],
    Categories : [],
    CurrentCategory : "Tous",
    isConnected : false,
    LeftArrow : document.querySelector('.LeftArrow'),
    GallerySectionModal : document.querySelector('.GallerySectionModal'),
    AddProjectSectionModal : document.querySelector('.AddProjectSectionModal'),
    BAddPhoto : document.querySelector('.BAddPhoto'),
    Token : localStorage.getItem('token'),
    UserId : localStorage.getItem('userId'),
    Src : null,
    BEditGroup: document.querySelectorAll('.BEditGroup'),
    TopBarEditMode : document.querySelector('.TopBar'),
    Header : document.getElementsByTagName("header")[0],
    Image : document.querySelector('#Photo'),
    TitleInput : document.querySelector('#Title'),
    Category : document.querySelector('#Category'),
    BSubmitProject : document.querySelector('.BSubmitProject'),
    PreviewImgElm : document.querySelector('.ImagePreview'),
    BUploadGroup : document.querySelector('.ButtonUploadGroup'),
    ImageIsOK : false,
    TitleIsOK : false,
    CatIsOK : false,

    "init" : () => {

        if(localStorage.getItem('token') )
            app.isConnected = true;

        if(app.isConnected)
        {
            const BEditProjects = document.querySelector('.BEditProjects');
            const LoginLink = document.querySelector('.LoginLink');

            app.TopBarEditMode.style.display = "flex";
            app.Header.style.position = "relative";
            app.Header.style.paddingTop = "40px";
            LoginLink.textContent = "logout";
            LoginLink.href = "./index.html";

            app.FilterProjectcs.style.visibility = "hidden";

            app.BEditGroup.forEach(Elm => {
                Elm.style.display = "flex";
            });

            LoginLink.addEventListener('click', app.logOut);

            BEditProjects.addEventListener('click', app.editHandler);
            app.BAddPhoto.addEventListener('click', app.addPhotoForm);
            document.body.style.overflowX = "hidden";
        }
        else
        {
            app.FilterProjectcs.style.display = "visible";
            app.TopBarEditMode.style.display = "none";
            app.Header.style.paddingTop = "0";
            app.BEditGroup.forEach(Elm => {
                Elm.style.display = "none";
            });
        }


        app.Projects = [];
        app.clearGallery();
        app.getCategories();
        app.getWorks();
    },
    "logOut" : () => {
        localStorage.clear();
        app.init();
    },
    "addPhotoForm" : () => {

        console.log('add photo form..');
        app.GallerySectionModal.style.display = "none";
        app.AddProjectSectionModal.style.display = "flex";
        app.LeftArrow.style.visibility = "visible";

        app.BSubmitProject.disabled = true;
        app.BSubmitProject.addEventListener('click', app.addNewProject);
        app.Image.addEventListener('change', app.imageIsOK );
        app.TitleInput.addEventListener('input', app.titleIsOK );
        app.Category.addEventListener('change', app.catIsOK );

        app.LeftArrow.addEventListener('click', app.editHandler);
    },
    "imageIsOK" : () =>
    {
        app.ImageIsOK = true;
        app.enableSubmitButton();
    },
    "titleIsOK" : (e) => {
        if(e.currentTarget.value.length > 0)
            app.TitleIsOK = true;
        else
            app.TitleIsOK = false;

        app.enableSubmitButton();
    },
    "catIsOK" : (e) =>
    {
        if(e.currentTarget.value.length > 0)
            app.CatIsOK = true;

        app.enableSubmitButton();
    },
    "enableSubmitButton" : () =>
    {
        if(app.TitleIsOK && app.CatIsOK && app.ImageIsOK)
            app.BSubmitProject.disabled = false;
    },
    "addNewProject" : () => {

        if(app.Image.src !== null && app.TitleInput.value.length > 0 &&
            app.Category.options.selectedIndex > 0)
        {

            let formD = new FormData();
            formD.append("image", app.Image.files[0]);
            formD.append("title", app.TitleInput.value.toString());
            formD.append("category", app.Category.options.selectedIndex.toString());

            const URL = "/works";
            const Method = "POST";

            app.fetchAPI(URL, Method, formD, app.Token, "multipart/form-data").then(res => {
                if(res)
                {
                    app.PreviewImgElm.style.display = "none";
                    app.BUploadGroup.style.display = "flex";
                    app.PreviewImgElm.src = "#";
                    app.removeAddProjectSection();
                }
            });

        }

    },
    "imageUpload" : (e) => {
        if(e.target.files.length > 0)
        {
            console.log(e.target.files);
            let src = URL.createObjectURL(e.target.files[0]);
            app.Src = e.target.files[0];
            const BSumbitProject = document.querySelector('.BSubmitProject');

            app.PreviewImgElm.style.display = "block";
            app.PreviewImgElm.src = src;
            app.PreviewImgElm.alt = e.target.files[0].name;
            app.BUploadGroup.style.display = "none";
        }
    },
    "editHandler" : () => {

        console.log('edit handler..');
        const ModalContainerElm = document.querySelector('.ModalContainer');
        const PhotosList = document.querySelector('.PhotosList');
        const CrossButton = document.querySelector('.Cross');
        app.GallerySectionModal.style.display = "block";
        app.AddProjectSectionModal.style.display = "none";
        app.LeftArrow.style.visibility = "hidden";


        CrossButton.addEventListener('click', app.removeModal);
        PhotosList.innerHTML = "";


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
    "removeAddProjectSection" : () => {
        app.GallerySectionModal.style.display = "block";
        app.AddProjectSectionModal.style.display = "none";
        app.LeftArrow.style.visibility = "hidden";

        app.removeModal();
        app.init();
    },
    "removeAllProjects" : (e) => {

        e.preventDefault();
        console.log(app.Projects);


        for(let i = 0; i < app.Projects.length; i++) {
            app.fetchAPI("/works/"+app.Projects[i].id, "DELETE", i, app.Token).then(res => {
                console.log(res);
            })

            console.log(i);
        }

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
    "removeProject" : (e, id = null) => {


            let idCurrentElm = null;
            if(id !== null)
                idCurrentElm = id;
            else
                idCurrentElm = parseInt(e.currentTarget.parentElement.id);


            const NbProjects = app.Projects.childElementCount;

            console.log("idelem : "+idCurrentElm);
            e.currentTarget.parentElement.parentNode.removeChild(e.currentTarget.parentElement);
            app.Projects.forEach((P, index) => {
                if (P.id === idCurrentElm)
                    app.Projects.splice(index, 1);
            })

        const Method = "DELETE";
        const URL = "/works/"+idCurrentElm;

        app.fetchAPI(URL, Method, idCurrentElm, app.Token).then(res => {
                console.log(res);
        });

        app.clearGallery();
        app.FilterProject(app.CurrentCategory);

    },
    "FilterProject" : (CatName) => {

        console.log(CatName);
        document.querySelectorAll('.FilterItem').forEach(FilterItem => {
            FilterItem.className = "FilterItem";
            if(FilterItem.textContent === CatName)
            {
                if(CatName === "Hôtels & restaurants")
                    CatName = "Hotels & restaurants";

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
        const FilterMenuItem = document.querySelector('.FilterProjects_Menu');

        FilterMenuItem.innerHTML = "";
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
                console.log(Project);
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




        if(CatName === "Tous")
            LiElm.className = LiClassName+" "+LiClassName_CurrentFitler;
        else
        LiElm.className = LiClassName;

        if(Cat.name === "Hotels & restaurants")
        CatName = "Hôtels & restaurants";

        LiElm.textContent = CatName;

        LiElm.addEventListener('click', () => (app.FilterProject(CatName) ));

        FilterMenuElm.appendChild(LiElm);
    },
    "clearGallery" : () => {
        app.Gallery.innerHTML = '';
    },
    "fetchAPI" : (URL, Method, Data = null, Token = null, ContentType = "application/json") => {

        const CurrentURL = app.URL_API_Base+URL;
        const Body = Data;
        const Header = {
            'Accept' : 'application/json',
            'Authorization': 'Bearer '+Token
        }

        let initGET = {
            method : Method,
            headers : Header
        }
        let initPOST = {
            method : Method,
            headers : Header,
            body : Body
        }

        let Init = initGET;
        if(Data !== null) {
            Init = initPOST;
        }

        return fetch(CurrentURL, Init)
            .then(res => {
               return res.json();
            })
    }
}


app.init();

