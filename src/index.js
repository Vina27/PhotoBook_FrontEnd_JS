//grabbing html elements 
let photoCollectionDiv = document.querySelector("#photo-collection")
    // console.log(photoCollectionDiv)
let addPhotoButton = document.querySelector("#new-photo-btn")
    // console.log(addPhotoButton)
let formContainer = document.querySelector(".container")
    // console.log(formContainer)
let photoForm = document.querySelector(".add-photo-form")
    console.log(photoForm)
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
    console.log(users[0].photos)
    //saving photo array to variable 
    let photoArray = users[0].photos
    photoArray.forEach(photo => displayPhotos(photo))
    photoFormFunc(users)
})

//this function will display users photos 
let displayPhotos = (photo) => {
    console.log(photo.book_id)
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
        
    let deletePhotoBtn = document.createElement("button")
        deletePhotoBtn.innerText = "delete"
    
    let editDescBtn =  document.createElement("button")
        editDescBtn.innerText = "Edit description"


    photoDiv.append(imgTag, pDesc, editDescBtn,  deletePhotoBtn)
    photoCollectionDiv.append(photoDiv)
    deletePhoto(deletePhotoBtn, photo, photoDiv)
    //invoking function 
    updatePhotoDesc(editDescBtn, pDesc, photo)

} //end of displayPhotoFunc

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
            console.log(editPhoto)
            //allows edit desc to show up DOM manipulation 
            pDesc.innerText = editPhoto.description 


        })

        })// end of addEventListener editForm 


    }) //end of eventlistener 

}
