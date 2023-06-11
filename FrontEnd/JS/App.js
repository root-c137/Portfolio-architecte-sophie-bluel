
let app = {
    URL_API_Base : "http://localhost:5678/api",
    FilterItems : document.querySelectorAll('.FilterItem'),
    Gallery : document.querySelector('.gallery'),
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

        const BSubmitProject = document.querySelector('.BSubmitProject');
        BSubmitProject.addEventListener('click', app.addNewProject);

        app.LeftArrow.addEventListener('click', app.editHandler);


    },
    "addNewProject" : () => {

        console.log("Add new...");
        const Image = document.querySelector('#Photo');
        const TitleInput = document.querySelector('#Title');
        const Category = document.querySelector('#Category');

        if(Image.src !== null && TitleInput.value.length > 0 &&
            Category.options.selectedIndex > 0)
        {
            console.log(TitleInput.value.toString());

            let formD = new FormData();
            formD.append("image", Image.files[0]);
            formD.append("title", TitleInput.value.toString());
            formD.append("category", Category.options.selectedIndex.toString());


            const URL = "/works";
            const Method = "POST";

            app.fetchAPI(URL, Method, formD, app.Token, "multipart/form-data").then(res => {
                if(res)
                {
                    app.removeAddProjectSection();
                }
            });

        }
        else
        console.log('il faut remplir les champs..');
    },
    "imageUpload" : (e) => {
        if(e.target.files.length > 0)
        {
            console.log(e.target.files);
            let src = URL.createObjectURL(e.target.files[0]);
            app.Src = e.target.files[0];
            let PreviewImgElm = document.querySelector('.ImagePreview');
            const BUploadGroup = document.querySelector('.ButtonUploadGroup');
            const BSumbitProject = document.querySelector('.BSubmitProject');

            PreviewImgElm.style.display = "block";
            PreviewImgElm.src = src;
            PreviewImgElm.alt = e.target.files[0].name;
            BUploadGroup.style.display = "none";
            BSumbitProject.disabled = false;
        }
    },
    "editHandler" : () => {

        console.log('edit handler..');
        const ModalContainerElm = document.querySelector('.ModalContainer');
        const PhotosList = document.querySelector('.PhotosList');
        const CrossButton = document.querySelector('.Cross');
        app.GallerySectionModal.style.display = "block";
        app.AddProjectSectionModal.style.display = "none";


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

        const Method = "DELETE";
        const URL = "/works/"+idCurrentElm;

        app.fetchAPI(URL, Method, null, app.Token).then(res => {
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

