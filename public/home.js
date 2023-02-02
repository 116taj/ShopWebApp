
//both functions take you to the form
function convert(){
    alert("In order to become an artist, you must submit art.")
    addArt()
}

function addArt(){
    alert("Redirecting to art form...")
    location.href='/artistSubmission'
}

//logs the user out and redirects
function logout(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200){
        alert("Successfully logged out. Redirecting to login page...")
        location.href = '/login'
    }
    }
    req.open("DELETE",'/login');
    req.setRequestHeader("Content-Type", "application/json");
    req.send();  
}