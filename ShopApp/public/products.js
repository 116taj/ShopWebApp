function addToCart(id){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
    if(this.readyState==4 && this.status==400){
        alert("you cannot purchase anymore of this item")
    }
    }
    req.open("PUT",'/cart');
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({"item": id, "amount": 1}));  
}

function categorySelected(){

}

function sortBy(){
    let choice = document.getElementById("categorySelect").value;
    if (choice != "-1"){
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==400){
            location.href="/products"
        }
        }
        req.open("PUT",'/cart');
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({"item": id, "amount": 1}));  
    }
    
}