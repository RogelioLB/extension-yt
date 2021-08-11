# Download Videos From YouTube | Extension For Google Chrome

Hello, everyone this is an extension for google chrome, that can download videos from YouTube. Quality 1080hd, 720hd and 480, in formats MP4 and MP3

### Things that you are gonna need


* Clone this repository
* Have installed [NodeJS](https://nodejs.org/en/)
* Have installed [Docker (optionally)](https://docs.docker.com/get-docker/)


## First clone this repository

If you don't have installed [git](https://git-scm.com/), also you can download the repository directly in file .zip

## So then you just need to locate in the folder server and write the command 
#### In git bash or cmd
```bash 
npm install && npm run start
```

#### In powershell windows
```bash 
npm install ; npm run start
```

### If you wanna do it in docker click [this](#docker)

## Now do the same in the folder of extension\client
#### In git bash or cmd
```bash 
npm install && npm run build
```

#### In powershell windows
```bash 
npm install ; npm run build
```
Doing this in the folder client will generate a folder named build, this is what you need for you extension


<h2 id="docker">Install the server in docker<h2>

### First you need to pull the image

```bash
docker pull rogeliolb/yt-extension
```

And then run it with
```bash 
docker run -dp 3000:3000 rogeliolb/yt-extension
```

## And finally just need to add the extension to google chrome

### Steps to add

1. Open Google Chrome
2. There must be an icon like a puzzle piece, click it
3. It will show all extensions that you have installed, just click in manage extensions
4. Now just enable developer mode
![Developer](https://i.ibb.co/DgRs0f3/developer.png)
5. There will be more buttons, click in Load unzipped or something like that
6. Select the folder build, inside the folder extension\client
7. And thats it, now you have the extension working