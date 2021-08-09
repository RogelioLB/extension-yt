let url;
let urlResponse;

chrome.tabs.executeScript(null,{file:"background.js"},(arr)=>{
    url = arr[0]
    if(!url.includes("https://www.youtube.com/watch")) alert("Need to be in a youtube video")
    getData(url)
})

const socket = io("http://localhost:3000");

socket.on("progress",data=>{
    console.log(data)
    document.getElementById("percentage").innerHTML = data.downloaded+"%"
})

socket.on("close",()=>{
    chrome.downloads.download({
        url:urlResponse
    })
})

const getData = async(url) =>{
    const res = await fetch("http://localhost:3000/download/info",{
        method:"POST",
        body:JSON.stringify({url:url}),
        headers:{
            "Content-Type": "application/json"
        }
    })
    const data = await res.json();
    console.log(data)
    const {title} = data.data.videoDetails;
    const thumb = data.data.videoDetails.thumbnails[3]

    document.getElementById("title").innerHTML = title
    const img = document.getElementById("thumb")
    img.src = thumb.url


    const formatsVideo = data.formatsVideo;
    const formatsAudio = data.formatsAudio;
    console.log(formatsVideo, formatsAudio)

    const format1080 = formatsVideo.find((format)=>format.quality === "1080p" || format.quality === "hd1080")
    createButton(format1080,"Video")
    const format720 = formatsVideo.find((format)=>format.quality === "720p" || format.quality === "hd720")
    createButton(format720,"Video")
    const format480 = formatsVideo.find((format)=>format.quality === "large" || format.quality === "hd480")
    createButton(format480,"Video")
    const tiny = formatsAudio.find((format)=>format.quality === "tiny")
    createButton(tiny,"Audio")
}


const createButton = (format,type) =>{
    if(!format) return;

    const button = `<button data=${format.itag}>${format.quality=="large" ? format.qualityLabel : format.quality}</button>`

    document.getElementById("formats"+type).innerHTML += button;

    const btn = document.querySelectorAll("button")[document.querySelectorAll("button").length-1]
        btn.addEventListener("click",async()=>{
            console.log("http://localhost:3000/download/"+type.toLowerCase())
            const itag = btn.getAttribute("data");
            const res = await fetch("http://localhost:3000/download/"+type.toLowerCase(),{
                method:"POST",
                body:JSON.stringify({itag:itag,url:url}),
                headers:{"Content-Type": "application/json"}
            })
            const data = await res.json()
            urlResponse = data.url
            alert(data.message)
        })
}