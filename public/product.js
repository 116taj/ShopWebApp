

//submit the review and send it to server
function review(){
    let rating = document.getElementById("reviewRating").value;
	let title = document.getElementById("title").value;
	let contents = document.getElementById("contents").value;
    let id = document.getElementById("id").innerHTML;
    let name = document.getElementById("name").innerHTML;
    let isValid = true;
	if (rating == "" || title == "" || contents == ""){
        alert("Error: Fill out all the required information!");
        isValid = false;
    }
    if (rating != "" && !Number.isInteger(Number(rating)) || Number(rating) > 5 || Number(rating) < 1){
        alert("Error: Rating must be a valid number!");
        if (isValid)
            isValid = false;
    }     
    if (isValid) {
        let req = new XMLHttpRequest();
		req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            alert("rating submitted.");
            location.reload()
        } else if (this.readyState == 4 && this.status == 400){
            alert("you have already reviewed this product!");
        }
		}
		req.open("POST",'/review');
		req.setRequestHeader("Content-Type", "application/json");
        let review = {id:id,rating: rating, title:title,contents:contents, name:name};
        console.log(review);  
		req.send(JSON.stringify(review));  
    }    
}

//adds an elem to cart

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