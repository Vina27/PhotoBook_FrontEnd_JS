//grabbing html elements 
let photoCollectionDiv = document.querySelector("#photo-collection")
    // console.log(photoCollectionDiv)
let addPhotoButton = document.querySelector("#new-photo-btn")
    // console.log(addPhotoButton)
let formContainer = document.querySelector(".container")
    // console.log(formContainer)
let photoForm = document.querySelector(".add-photo-form")
    //console.log(photoForm)
    let addPhoto = false 

addPhotoButton.addEventListener("click", (evt) => {
        // console.log("hello")
        //! toggling between true and false on Click
        addPhoto = !addPhoto
        // console.log(addPhoto)
    if (addPhoto){
        formContainer.style.display = "block"
    
    } else {
        formContainer.style.display = "none"
    }

    })
//fetching users from the backend 
fetch("http://localhost:3000/users")
.then(resp => resp.json()) 
.then(users => {
    //console.log(users[0].photos)
    //saving photo array to variable 
    let photoArray = users[0].photos
    photoArray.forEach(photo => displayPhotos(photo))
    photoFormFunc(users)
})

//this function will display users photos 
let displayPhotos = (photo) => {
    //console.log(photo.book_id)
    let photoDiv = document.createElement("div")
    // console.log(photo)
    photoDiv.className = "card"

    let imgTag = document.createElement("img")
        imgTag.src = photo.img_url
        imgTag.className = "photo-card"
        // console.log(imgTag)
    let pDesc = document.createElement("p")
        // console.log(pDesc)
        pDesc.innerText = photo.description 

    let likeNum = document.createElement("p")
        likeNum.innerText = `${photo.likes} Likes`
        // likeNum.innerText = photo.likes
        console.log(likeNum)
        
    let deletePhotoBtn = document.createElement("button")
        deletePhotoBtn.innerText = "delete"
    
    let editDescBtn =  document.createElement("button")
        editDescBtn.innerText = "Edit description"

    let likeBtn = document.createElement("button")
        likeBtn.innerText =  "Like" 

    photoDiv.append(imgTag, pDesc, likeNum, likeBtn, editDescBtn,  deletePhotoBtn)
    photoCollectionDiv.append(photoDiv)
    deletePhoto(deletePhotoBtn, photo, photoDiv)
    //invoking function 
    updatePhotoDesc(editDescBtn, pDesc, photo)
    likePhoto(likeBtn, likeNum, photo)

} //end of displayPhotoFunc

let likePhoto = (likeBtn, likeNum, photo) => {
    likeBtn.addEventListener("click", (evt) => {
       // console.log(photo.likes)
        if (photo.likes === null || photo.likes === undefined){
            photo.likes = 0 
            console.log(photo.likes)
        }else {
            console.log("this is a real number")
        }

        let theNewLikes = photo.likes + 1
        // console.log("The New Likes Becomes", theNewLikes)
        // update +1 photo.likes before fetch request
        // write fetch request with url that includes photo id
        // use PATCH method
        // in body only add likes attribute 
        // then statements 

        fetch(`http:/localhost:3000/photos/${photo.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
                likes: theNewLikes
              })
            })
            .then(res => res.json())
            //update dom
            .then((updatedPhoto) => {
              //razzmatzz element updating DOM
              likeNum.innerText = `${updatedPhoto.likes} Likes`
              //alters object in memeory will not update w/o code below 
              photo.likes = updatedPhoto.likes
            })
    })
}
// Function to delete photo
let deletePhoto = (deletePhotoBtn, photo, photoDiv) => {
    // console.log(deletePhotoBtn)
    deletePhotoBtn.addEventListener("click", (evt) => {
        // console.log("hello")
    fetch(`http://localhost:3000/photos/${photo.id}`, {
        method: "DELETE"

    }) 
    .then(res => res.json())
    .then(deletedPhoto => {
        // console.log(deletedPhoto)
        photoDiv.remove()
    })

    }) //end of eventListener
}
// Function to create photo
let photoFormFunc = (users) => {


photoForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
   
    let theImg = evt.target.image.value
    let theDescription = evt.target.description.value
    //creates new photo from back end 
    fetch("http://localhost:3000/photos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        description: theDescription, //from above let 
        book_id: users[0].books[0].id,
        img_url: theImg
      })
    })
    .then(res => res.json())
    .then((newPhoto) => {
        displayPhotos(newPhoto)
      //clears out input after submitting form 
      evt.target.reset()
    })
    
  })

}
//end of photo form 

let updatePhotoDesc = (editDescBtn, pDesc, photo) => {
    // console.log(editDescBtn)

    editDescBtn.addEventListener("click", (evt) => {
        // console.log("hello")
        //when btn is clicked a form shouold appear 
    let editForm = document.createElement("form")
        // console.log(editForm)
        editForm.innerHTML = `<textarea rows="4" cols="50" type="text" name="description"
        placeholder= "edit this description...."></textarea><br>
        <input type="submit" value="Submit">`
        // console.log(editForm)
        pDesc.append(editForm)
        
        editForm.addEventListener("submit", (evt) => {
            evt.preventDefault()
    
        fetch(`http://localhost:3000/photos/${photo.id}`, {
            method: "PATCH", 
            headers: {
                "content-type": "application/json", 
                Accept: "application/json"

            }, 
            body: JSON.stringify({
                description: evt.target.description.value, 
               })
        })// end of fetch 
        .then(res => res.json())
        .then(editPhoto => {
            //console.log(editPhoto)
            //allows edit desc to show up DOM manipulation 
            pDesc.innerText = editPhoto.description 


        })

        })// end of addEventListener editForm 


    }) //end of eventlistener 

}

//creating like button 
// add like attribute to photo model rails backend
// by default set it to 0 
// frontend create like button for each photo
// addeventlistener to like button 
// make a patch request for specific photo
