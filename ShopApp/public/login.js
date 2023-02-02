//attempts login
function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username === "" || password === ""){
        alert("Please input both fields.")
    } else {
        let req = new XMLHttpRequest();
		req.onreadystatechange = function() {  
        if(this.readyState==4 && this.status==200){ 
		if(this.responseText == "true"){
            alert("Successfully logged in. Redirecting to homepage...")
            location.href="/";
        } else 
            alert("Error: wrong username or password")
        }    
		}
		req.open("PUT",'/login');
		req.setRequestHeader("Content-Type", "application/json");
        let login = {username: username, password: password};
		req.send(JSON.stringify(login));  
    }
}
//attempts register
function register(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username === "" || password === ""){
        alert("Please input both fields.")
    } else {
        let req = new XMLHttpRequest();
		req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            console.log(this.status);
            if(this.responseText == "true"){
                alert("Successfully registered. Redirecting to homepage...")
                location.href="/";
            } else 
                alert("Error: this username is taken!")
        }
		}
		req.open("POST",'/login');
		req.setRequestHeader("Content-Type", "application/json");
        let login = {username: username, password: password};
		req.send(JSON.stringify(login));  
    }
}