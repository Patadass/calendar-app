let loginButton = document.querySelector("button");
let uNameInput =document.querySelector("#uNameInput");
let pInput =document.querySelector("#pInput");
loginButton.addEventListener("click",makeRequest);

function makeRequest(e){
    if(uNameInput.value.trim()!="" && pInput.value.trim()!=""){
        let obj = {
            name:uNameInput.value,
            pword:pInput.value
        }
        let http = new XMLHttpRequest();
        http.open('POST', "http://localhost:8008/login", true);
        http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                //Send the proper header information along with the request
        http.onload = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                    window.location.href = "http://localhost:8008/";
    
                }else{
                    alert(http.status);
                }
            }
        http.send(JSON.stringify(obj));
    }else{
        alert("Empty fields!!");
    }
    
}

