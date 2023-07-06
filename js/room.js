let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});

let roomid = document.getElementById("disp-rid" )
roomid.textContent  = localStorage.getItem("roomID")


let displayFrame = document.getElementById("stream__box")
let videoFrames = document.getElementsByClassName("video__container")
let usidinDisplayFrame=null;
let expandVideoFrame =(e)=>{
  let flag=false;
  displayFrame.style.display='block'
let child = displayFrame.children[0]
if(child){
  document.getElementById("streams__container").appendChild(child)
}
displayFrame.appendChild(e.currentTarget)
if(usidinDisplayFrame===e.currentTarget.id){
  // unpinning the user video
  displayFrame.style.display=null
  flag =true;
  for(let i=0 ; i<videoFrames.length;i++){
     
     videoFrames[i].style.height='300px'
     videoFrames[i].style.width='300px'
   
   }
   let child  = displayFrame.children[0]
   document.getElementById('streams__container').appendChild(child)
   usidinDisplayFrame=null
}

if(!flag){
  usidinDisplayFrame = e.currentTarget.id
for(let i=0 ; i<videoFrames.length;i++){
 if(videoFrames[i].id != usidinDisplayFrame){
 
  //videoFrames[i].style.width='100px'
 
  videoFrames[i].style.height='100px'
  videoFrames[i].style.width='100px'
}
}}

}

for(let i=0 ; i<videoFrames.length;i++){
  videoFrames[i].addEventListener('click' ,expandVideoFrame)
}

