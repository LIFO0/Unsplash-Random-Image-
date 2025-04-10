const clientID = "JKzzGhpBqaHNC3UV9Rwt-rYT42z6mhYhcOwWNA-NOFw";
const endpoint = `https://api.unsplash.com/photos/random?client_id=${clientID}&orientation=landscape&query=wallpapers&content_filter=high`;

let imageElement = document.querySelector("#unsplashImage");
let linkElement = document.querySelector("#imageLink");
let creatorElement = document.querySelector("#creator");

let buttonChangeImage = document.querySelector("#changeButton");
buttonChangeImage.addEventListener("click", changeImageFunc);

async function changeImageFunc() {
    try {
        const response = await fetch(endpoint);
        const jsonData = await response.json();
        const imageUrl = jsonData.urls.full;


        await cacheImage(imageUrl);
        localStorage.setItem("lastImageUrl", imageUrl);
        localStorage.setItem("lastLoadTime", new Date().getTime().toString());
        // imageElement.src = jsonData.urls.regular;
        document.body.style.backgroundImage = `url(${imageUrl})`;
        linkElement.setAttribute("href", jsonData.links.html);

        creatorElement.innerText = jsonData.user.name;
        creatorElement.setAttribute("href", jsonData.user.portfolio_url);
        
    } catch(error){
        console.error("Error: " + error);
    }
}

async function cacheImage(url) {
    const cache = await caches.open("image-cache");
    cache.add(url);
    
}

async function getCachedImage(url) {
    const cache = await caches.open("image-cache");
    const response = await cache.match(url);
    if (response) {
        return URL.createObjectURL(await response.blob());
    }
    return null;
    
}

async function loadImageOnStart() {
    const lastImageUrl = localStorage.getItem("lastImageUrl");
    const lastLoadTime = localStorage.getItem("lastLoadTime");
    const now = new Date().getTime();
    const twelveHouse = 12 * 60 * 60 * 1000;
    if (lastImageUrl && lastLoadTime && (now - lastLoadTime < twelveHouse)) {
        const cachedImage = await getCachedImage(lastImageUrl);
        if (cachedImage) {
            document.body.style.backgroundImage = `url(${cachedImage})`;
            return;
        }
    }
    await changeImageFunc();
    
}

window.addEventListener("load", loadImageOnStart);

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('time').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

