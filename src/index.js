//grabbing html elements 
let photoCollectionDiv = document.querySelector("#photo-collection")
    // console.log(photoCollectionDiv)


//fetching users from the backend 
fetch("http://localhost:3000/users")
.then(resp => resp.json()) 
.then(users => {
    console.log(users[0].photos)
    //saving photo array to variable 
    let photoArray = users[0].photos
    photoArray.forEach(photo => displayPhotos(photo))
})

//this function will display users photos 
let displayPhotos = (photo) => {
    let photoDiv = document.createElement("div")
    // console.log(photo)
    photoDiv.className = "card"

    let imgTag = document.createElement("img")
        imgTag.src = photo.img_url
        imgTag.className = "photo-card"
        console.log(imgTag)
        
    photoDiv.append(imgTag)
    photoCollectionDiv.append(photoDiv)
}