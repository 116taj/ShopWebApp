function clearCart(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200){
        location.reload();
    }
    }
    req.open("DELETE",'/cart');
    req.setRequestHeader("Content-Type", "application/json");
    req.send();  
}

function order(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200){
        alert("order submitted");
        let cartReq = new XMLHttpRequest();
        cartReq.open("DELETE",'/cart');
        cartReq.setRequestHeader("Content-Type", "application/json");
        cartReq.send();  
        location.reload();
    }
    }
    req.open("post",'/order');
    req.setRequestHeader("Content-Type", "application/json");
    req.send(); 
}