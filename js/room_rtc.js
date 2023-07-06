const APP_ID="32ae2be63a9243d3a37fb9a5cbfeee6b"
let uid = sessionStorage.getItem('uid')
if(!uid){
    uid = String(Math.floor(Math.random() * 10000))
    sessionStorage.setItem('uid' , uid);
}
let token = null ;
let client ;
console.log(uid);

let rtmClient;
let channel;


const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
let roomId  = urlParams.get('room')
console.log(roomId);
if(!roomId){
    roomId='main'

}
console.log(roomId);
let display_Name = sessionStorage.getItem("displayName")
if(!display_Name){
    window.location = 'index.html'
}

let camera =false
let localTracks = []
let remoteUsers = {}
let localScreens
let screenSharing=false

let joinroomINIT = async() => {
  rtmClient =await AgoraRTM.createInstance(APP_ID)  
  await rtmClient.login({uid,token})

  await rtmClient.addOrUpdateLocalUserAttributes({'name' : display_Name})

  channel = await rtmClient.createChannel(roomId)
  await channel.join()
  channel.on('MemberJoined',handleMemberJoined)
  channel.on('MemberLeft',handleMemberLeft)
  channel.on('ChannelMessage',handleChannelMessage)
getMembers()

addBotMessagetoDOM(`Welcome to the room ${display_Name}! 👋`)


    client= AgoraRTC.createClient({mode:'rtc' , codec:'vp8'})
    await client.join(APP_ID , roomId,token,uid)
   
client.on('user-published' , handleUserPublished)
client.on('user-left' , handleUserLeft)




}

let joinStream = async() => {
document.getElementById('join-btn').style.display='none'
document.getElementsByClassName('stream__actions')[0].style.display='flex'

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        {},{encoderConfig:{
            width:{min:640,ideal:1920,max:1920},
            height:{min:480,ideal:1080,max:1080}
        }}
    )

    let player =    `<div class="video__container" id="user-container-${uid}">
                            <div class = "video-player" id="user-${uid}"> </div>
                            </div>`
                            document.getElementById('streams__container').insertAdjacentHTML('beforeend' , player)

                            localTracks[1].play(`user-${uid}`)
        await client.publish([localTracks[0] , localTracks[1]])

    document.getElementById(`user-container-${uid}`).addEventListener('click' , expandVideoFrame)


                        }

let switchTocam=async()=>{
    let player =    `<div class="video__container" id="user-container-${uid}">
    <div class = "video-player" id="user-${uid}"> </div>
    </div>`
    displayFrame.insertAdjacentHTML('beforeend' , player)
    await localTracks[0].setMuted(true)
    await localTracks[1].setMuted(true)
    document.getElementById("screen-btn").classList.remove('active')
    document.getElementById("mic-btn").classList.remove('active')
    localTracks[1].play(`user-${uid}`)
    await client.publish([ localTracks[1]])


}
                       
                           
let handleUserPublished  = async(user , mediaType)=>{
console.log(user);
    remoteUsers[user.uid] = user


    await client.subscribe(user , mediaType)
    let player1 = document.getElementById(`user-container-${user.uid}`)
    if(player1 === null)
    {player1 =    `<div class="video__container" id="user-container-${user.uid}">
    <div class = "video-player" id="user-${user.uid}"> </div>
    </div>`
    document.getElementById('streams__container').insertAdjacentHTML('beforeend' , player1)
}
if(displayFrame.style.display){
    let videoFrame=document.getElementById(`user-container-${user.uid}`)
    videoFrame.style.height='100px'
    videoFrame.style.width='100px'
}
        if(mediaType==='video'){
            user.videoTrack.play(`user-${user.uid}`)
        }
        if(mediaType==='audio'){
            user.audioTrack.play()
        }
        document.getElementById(`user-container-${user.uid}`).addEventListener('click' , expandVideoFrame)



}

let handleUserLeft=async(user)=>{
          delete  remoteUsers[user.uid]
          let ii = document.getElementById(`user-container-${user.uid}`)
          if(ii) {
            ii.remove()
          }
          document.getElementById(`user-container-${user.uid}`).remove()
          console.log( "User Left:  ",usidinDisplayFrame);  
          if(usidinDisplayFrame===`user-container-${user.uid}`){
                displayFrame.style.display=null
                for(let i=0 ; i< videoFrames.length;i++){
                    videoFrames[i].style.height='300px'
                    videoFrames[i].style.width='300px'
                } 
            }

        }
        let toggleCam =async(e)=>{
            let button = e.currentTarget
            if(localTracks[1].muted){
                await localTracks[1].setMuted(false)
                
                button.classList.add('active')
            }
            else{

                await localTracks[1].setMuted(true)   
                button.classList.remove('active')
            }
        }
        let toggleMic =async(e)=>{
            let button = e.currentTarget
            if(localTracks[0].muted){
                await localTracks[0].setMuted(false)
                
                button.classList.add('active')
            }
            else{

                await localTracks[0].setMuted(true)   
                button.classList.remove('active')
            }
        }
        let toggleScreem=async(e)=>{
                    let screenBtn =e.currentTarget
                    let cameraBtn = document.getElementById("cam-btn")

                    if(!screenSharing ){
                        cameraBtn.classList.remove('active');
                        cameraBtn.style.display = 'none'
                        screenBtn.classList.add('active')
                        screenSharing=true

                        localScreens= await AgoraRTC.createScreenVideoTrack({ withAudio: "enable"})
                        document.getElementById(`user-container-${uid}`).remove()
                        displayFrame.style.display='block'

                        let player =    `<div class="video__container" id="user-container-${uid}">
                            <div class = "video-player" id="user-${uid}"> </div>
                            </div>`

                            displayFrame.insertAdjacentHTML('beforeend',player)
                            document.getElementById(`user-container-${uid}`).addEventListener('click' , expandVideoFrame)
                           
                           
                            usidinDisplayFrame = `user-container-${uid}`
                        localScreens.play(  `user-${uid}`)
                        await client.unpublish(localTracks[1])
                        await client.publish(localScreens)
                        for(let i=0 ; i<videoFrames.length;i++){
                            if(videoFrames[i].id != usidinDisplayFrame){
                            
                             //videoFrames[i].style.width='100px'
                            
                             videoFrames[i].style.height='100px'
                             videoFrames[i].style.width='100px'
                           }
                           }
                        }
                    else{
                        screenSharing=false
                        cameraBtn.style.display='block'
                        screenBtn.classList.remove('active')
                        document.getElementById(`user-container-${uid}`).remove()
                        await client.unpublish([localScreens])
                        switchTocam()
                    }


        }

        let leaveStream = async(e)=>{
            e.preventDefault()

            document.getElementById('join-btn').style.display='block'
            document.getElementsByClassName('stream__actions')[0].style.display='none'
            for(let i = 0 ; i < localTracks.length;i++){
                localTracks[i].stop();
                localTracks[i].close();
            }
            await client.unpublish([localTracks[0] , localTracks[1]])

            if(localScreens){
                await client.unpublish([localScreens])
            }
                document.getElementById(`user-container-${uid}`).remove()

                if(usidinDisplayFrame === `user-container-${uid}`)
                {
                    displayFrame.style.display = null
                    for(let i=0 ; i< videoFrames.length;i++){
                        videoFrames[i].style.height='300px'
                        videoFrames[i].style.width='300px'
                    } 
                }

                channel.sendMessage({text:JSON.stringify({'type' : 'user_left', 'uid':uid})})            

        }


        document.getElementById("cam-btn").addEventListener('click',toggleCam)
        document.getElementById("mic-btn").addEventListener('click',toggleMic)
        document.getElementById("screen-btn").addEventListener('click',toggleScreem)
        document.getElementById('join-btn').addEventListener('click' ,  joinStream)
        document.getElementById('leave-btn').addEventListener('click' ,  leaveStream)

        joinroomINIT()