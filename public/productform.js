
function categorySelected(){
    let category = document.getElementById("categorySelect").value;
    let productDiv = document.getElementById("productDiv");
    let formDiv = document.getElementById("formDiv");
    document.getElementById("newFormPrompt").innerHTML = "";
    productDiv.innerHTML = "";
    formDiv.innerHTML = "";
    if (category == "-1"){
        return;
    }
    let req = new XMLHttpRequest();
		req.onreadystatechange = function() {
		if(this.readyState==4 && this.status == 200){
            //create new select with all matching products
            let productDiv = document.getElementById("productDiv");
            productDiv.innerHTML = "";
            let title = document.createElement("h2");
            title.id = "productTitle";
            title.textContent = "Select a product:";
            productDiv.appendChild(title);
            let productSelect = document.createElement("select");
            let defaultOption = document.createElement("option");
            defaultOption.setAttribute("value","-1");
            defaultOption.appendChild(document.createTextNode("Select"));
            productSelect.appendChild(defaultOption);
            productSelect.id = "product";
            let products = JSON.parse(this.responseText);
            products.forEach(elem => {
                let option = document.createElement("option");
                option.setAttribute("value",elem._id);
                option.appendChild(document.createTextNode(elem.name));
                productSelect.appendChild(option);
            });
            productSelect.onchange = productSelected;
            productDiv.appendChild(productSelect);
        }
		}
        console.log(JSON.stringify(category));
		req.open("GET",'/admin/products/'+category);
		req.setRequestHeader("Content-Type", "application/json"); 
        console.log(req);
		req.send();  
}

function productSelected(){
    let productID = document.getElementById("product").value;
    let formDiv = document.getElementById("formDiv");
    formDiv.innerHTML = "";
    if (productID == "-1"){
        return;
    }
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
    if(this.readyState==4 && this.status == 200){
        //create new select with all matching products
        console.log(this.responseText);
        let product = JSON.parse(this.responseText);
        let title = document.createElement("h2");
        title.id = "editTitle";
        title.textContent = "Edit the product:";
        formDiv.appendChild(title);

        let image = document.createElement("img");
        image.src = product.image;
        image.width = 200;
        image.height = 200;
        formDiv.appendChild(image);

        let name = document.createElement("p");
        let nameInput = document.createElement("input");
        nameInput.value = product.name;
        nameInput.id = "name";
        name.innerHTML = "Name: "
        name.append(nameInput);
        formDiv.appendChild(name);

        let price = document.createElement("p");
        let priceInput  = document.createElement("input");
        priceInput.value = product.price;
        priceInput.id = "price";
        price.innerHTML = "Price: "
        priceInput.size = 5;
        price.append(priceInput);
        formDiv.appendChild(price);

        let stock = document.createElement("p");
        let stockInput  = document.createElement("input");
        stockInput.value = product.stock;
        stockInput.id = "stock";
        stock.innerHTML = "Stock: "
        stockInput.size = 5;
        stock.append(stockInput);
        formDiv.appendChild(stock);

        let description = document.createElement("p");
        let descriptionInput  = document.createElement("input");
        descriptionInput.value = product.description;
        descriptionInput.id = "description";
        descriptionInput.size = 50;
        description.innerHTML = "Description: "
        description.append(descriptionInput);
        formDiv.appendChild(description);

        let category = document.createElement("p");
        let categoryInput  = document.createElement("input");
        categoryInput.value = product.category;
        categoryInput.id = "category";
        category.innerHTML = "Category: "
        categoryInput.size = 15;
        category.append(categoryInput);
        formDiv.appendChild(category);


        let imageSelect = document.createElement("input");
        imageSelect.type = "file";
        imageSelect.id = "img";
        imageSelect.accept="image/*";
        formDiv.appendChild(imageSelect);
        formDiv.appendChild(document.createElement("br"));
        formDiv.appendChild(document.createElement("br")); 

        let submit = document.createElement("button");
        submit.onclick = submitChanges;
        submit.textContent = "Submit";
        formDiv.appendChild(submit);
        formDiv.appendChild(document.createElement("br"));
        let deleteButton = document.createElement("button");
        deleteButton.onclick = deleteProduct;
        deleteButton.textContent = "Delete Product";
        formDiv.appendChild(deleteButton);
        console.log(deleteButton)
        
    }
    }
    req.open("GET",'/products/'+productID);
    req.setRequestHeader("Content-Type", "application/json"); 
    console.log(req);
    req.send();  
}

function submitChanges(){
    console.log(document.getElementById("img").files[0])
    if (document.getElementById("img").files[0] != null){
        let imageReq = new XMLHttpRequest();
		imageReq.onreadystatechange = function() {
		if(this.readyState==4 && this.status == 400){
            alert("Image must be filetype png or jpg!")
        } else if (this.readyState==4 && this.status == 200){
            let imgName = this.responseText;    
            let req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if(this.readyState==4 && this.status == 200){
                    alert("changes saved")
                    location.reload();
                }
            }
            let productID = document.getElementById("product").value;
            let name = document.getElementById("name").value;
            let price = document.getElementById("price").value;
            let stock = document.getElementById("stock").value;
            let category = document.getElementById("category").value;
            let description = document.getElementById("description").value;
            //verify it is not empty
            let isValid = true;
            if (name == "" || category == "" || description == ""){
                alert("Error: Fill out all the required information!");
                isValid = false;
            }
            if (!Number(price)){
                alert("Error: Price must be a number!");
                isValid = false;
            }   
            if (!Number(stock)){
                alert("Error: Stock must be a number!");
                isValid = false;
            }   
            req.open("PUT",'/products/'+productID);
            req.setRequestHeader("Content-Type", "application/json"); 
            let updatedProduct = {"name": name, "price": price, "stock": stock, "category": category, "description": description, "image": "/images/"+imgName}
            req.send(JSON.stringify(updatedProduct));              
        }
		}
        let formData = new FormData();
        let img = document.getElementById("img").files[0];
        formData.append("image",img);
        console.log(formData);
        imageReq.open("POST",'/image/'+ document.getElementById("name").value);
        imageReq.send(formData);
    } else {
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState==4 && this.status == 200){
                alert("changes saved")
                location.reload();
            }
        }
        let productID = document.getElementById("product").value;
        let name = document.getElementById("name").value;
        let price = document.getElementById("price").value;
        let stock = document.getElementById("stock").value;
        let category = document.getElementById("category").value;
        let description = document.getElementById("description").value;
        //verify it is not empty
        let isValid = true;
        if (name == "" || category == "" || description == ""){
            alert("Error: Fill out all the required information!");
            isValid = false;
        }
        if (!Number(price)){
            alert("Error: Price must be a number!");
            isValid = false;
        }   
        if (!Number(stock)){
            alert("Error: Stock must be a number!");
            isValid = false;
        }   
        if (isValid){
            req.open("PUT",'/products/'+productID);
            req.setRequestHeader("Content-Type", "application/json"); 
            let updatedProduct = {"name": name, "price": price, "stock": stock, "category": category, "description": description}
            req.send(JSON.stringify(updatedProduct));  
        } 
    }
}

function newForm(){
        document.getElementById("editForm").innerHTML = "";
        document.getElementById("newFormPrompt").innerHTML = "";
        let formDiv = document.getElementById("newForm");
        let title = document.createElement("h2");
        title.id = "newTitle";
        title.textContent = "Create the product:";
        formDiv.appendChild(title);

        let name = document.createElement("p");
        let nameInput = document.createElement("input");
        nameInput.id = "name";
        name.innerHTML = "Name: "
        name.append(nameInput);
        formDiv.appendChild(name);

        let price = document.createElement("p");
        let priceInput  = document.createElement("input");
        priceInput.id = "price";
        price.innerHTML = "Price: "
        priceInput.size = 5;
        price.append(priceInput);
        formDiv.appendChild(price);

        let stock = document.createElement("p");
        let stockInput  = document.createElement("input");
        stockInput.id = "stock";
        stock.innerHTML = "Stock: "
        stockInput.size = 5;
        stock.append(stockInput);
        formDiv.appendChild(stock);

        let description = document.createElement("p");
        let descriptionInput  = document.createElement("input");
        descriptionInput.id = "description";
        descriptionInput.size = 50;
        description.innerHTML = "Description: "
        description.append(descriptionInput);
        formDiv.appendChild(description);

        let category = document.createElement("p");
        let categoryInput  = document.createElement("input");
        categoryInput.id = "category";
        category.innerHTML = "Category: "
        categoryInput.size = 15;
        category.append(categoryInput);
        formDiv.appendChild(category);


        let imageSelect = document.createElement("input");
        imageSelect.type = "file";
        imageSelect.id = "img";
        imageSelect.accept="image/*";
        formDiv.appendChild(imageSelect);
        formDiv.appendChild(document.createElement("br"));
        formDiv.appendChild(document.createElement("br")); 

        let submit = document.createElement("button");
        submit.onclick = submitNew;
        submit.textContent = "Submit Changes";
        formDiv.appendChild(submit);
}

function submitNew(){
    let imageReq = new XMLHttpRequest();
    imageReq.onreadystatechange = function() {
    if(this.readyState==4 && this.status == 400){
        alert("Image must be filetype png or jpg!")
    } else if (this.readyState==4 && this.status == 200){
        let imgName = this.responseText;    
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState==4 && this.status == 200){
                alert("product saved")
                location.reload();
            }
        }
        let name = document.getElementById("name").value;
        let price = document.getElementById("price").value;
        let stock = document.getElementById("stock").value;
        let category = document.getElementById("category").value;
        let description = document.getElementById("description").value;
        //verify it is not empty
        let isValid = true;
        if (name == "" || category == "" || description == ""){
            alert("Error: Fill out all the required information!");
            isValid = false;
        }
        if (!Number(price)){
            alert("Error: Price must be a number!");
            isValid = false;
        }   
        if (!Number(stock)){
            alert("Error: Stock must be a number!");
            isValid = false;
        }   
        if (isValid){
            req.open("POST",'/products');
            req.setRequestHeader("Content-Type", "application/json"); 
            let updatedProduct = {"name": name, "price": price, "stock": stock, "category": category, "description": description, "image": "/images/"+imgName}
            req.send(JSON.stringify(updatedProduct));              
        }
        }           
    }
    let formData = new FormData();
    let img = document.getElementById("img").files[0];
    if (img == undefined){
        img = "none.png";
    } 
    formData.append("image",img);
    console.log(formData);
    imageReq.open("POST",'/image/'+ document.getElementById("name").value);
    imageReq.send(formData); 
}

function deleteProduct(){
    let productID = document.getElementById("product").value;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
    if(this.readyState==4 && this.status == 200){
        alert("product deleted");
        location.reload();
    }
    }
    console.log(JSON.stringify(category));
    req.open("DELETE",'/products/'+productID);
    req.setRequestHeader("Content-Type", "application/json"); 
    req.send();  
}