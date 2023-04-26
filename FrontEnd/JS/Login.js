

let login =
{
    URL_API_Base : "http://localhost:5678/api",
    ErrorMsg : "Erreur dans l’identifiant ou le mot de passe",
    ErrorMsgElm : document.querySelector('.ErrorMsg'),
    EmailInput : document.querySelector('#Email'),
    PassInput : document.querySelector('#Pass'),
    "init" : () => {
        const BLogin = document.querySelector('.BLogin');
        BLogin.addEventListener('click', login.fetchLogin )
    },
    "fetchLogin" : (e) => {
        e.preventDefault();
        const LoginURL = "/users/login";
        const Method = "POST";
        const CurrentURL = login.URL_API_Base+LoginURL;
        const Body = JSON.stringify({
            "email" : login.EmailInput.value,
            "password" : login.PassInput.value
        });

        const Header = {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
        }


        let Init = {
                method : Method,
                headers : Header,
                body : Body,
                mode : 'cors'
        }


        return fetch(CurrentURL, Init)
                .then(res => {
                    if(res.status !== 200)
                        login.ErrorMsgElm.style.display = "block";
                    else
                        return res.json();
                })
                .then(res => {

                    if(res !== undefined)
                    {
                        localStorage.setItem("token", res.token);
                        document.location.href = "./index.html";
                    }
                });
    }
}


login.init();

