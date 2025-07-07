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