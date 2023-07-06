let handleMemberJoined = async(MemberId)=>{
console.log("New member has joined the room" , MemberId);
addMemberinDOM(MemberId)
let members = await channel.getMembers()
updateTotalMemberCount(members)

let {name} =await rtmClient.getUserAttributesByKeys(MemberId , ['name']) 
addBotMessagetoDOM(`Welcome to the room ${name}! 👋`)

}
let addMemberinDOM = async(MemberId) =>{
    let {name} =await rtmClient.getUserAttributesByKeys(MemberId , ['name']) 
let membersWrapper = document.getElementById('member__list')
let memberItem = `<div id="member__list">
    <div class="member__wrapper" id="member__${MemberId}__wrapper">
    <span class="green__icon"></span>
    <p class="member_name">${name}</p>
    </div>`
membersWrapper.insertAdjacentHTML('beforeend' , memberItem)

}
let addMessagetoDOM =(name , message)=>{
    let messageWrapper = document.getElementById('messages')

    let newMessage = `   <div class="message__wrapper">
    <div class="message__body">
        <strong class="message__author">${name}</strong>
        <p class="message__text">${message}</p>
    </div>
</div>`
messageWrapper.insertAdjacentHTML('beforeend' , newMessage)
let lastMessage=document.querySelector('#messages .message__wrapper:last-child')
if(lastMessage){
    lastMessage.scrollIntoView()
}

}
let addBotMessagetoDOM =(botMessage)=>{
    let messageWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">${botMessage}</strong>
                            <p class="message__text__bot"></p>
                        </div>
                    </div>`
messageWrapper.insertAdjacentHTML('beforeend' , newMessage)
let lastMessage=document.querySelector('#messages .message__wrapper:last-child')
if(lastMessage){
    lastMessage.scrollIntoView()
}

}
let updateTotalMemberCount = async(members)=>{
    let total = document.getElementById('members__count')
    total.innerText = members.length

}


let handleMemberLeft =async(MemberId)=>{
    removeMemberfromDOM(MemberId)
    let members = await channel.getMembers()
updateTotalMemberCount(members)
}

let getMembers=async()=>{
  
    
    let members = await channel.getMembers()
    updateTotalMemberCount(members)
    console.log("Inside getMembers: OUTSIDE LOOP" ,members);
    for(let i = 0 ; i<members.length; i++){
        addMemberinDOM(members[i])
        console.log("Inside getMembers: " , members[i]);
    }


}
let handleChannelMessage=async(messageData , MemberId)=>{
    console.log("New Message Recieved");
    let data  = JSON.parse(messageData.text)
    if(data.type === 'chat'){
addMessagetoDOM(data.displayName,data.message)

    }
    if(data.type ==='user_left'){

        document.getElementById(`user-container-${data.uid}`).remove()

        
        if(usidinDisplayFrame === `user-container-${uid}`)
        {
            displayFrame.style.display = null
            for(let i=0 ; i< videoFrames.length;i++){
                videoFrames[i].style.height='300px'
                videoFrames[i].style.width='300px'
            } 
        }

    }

    console.log('Message : ' ,data);
}

let sendMessage=async(e)=>{
    e.preventDefault()
    let message = e.target.message.value
    channel.sendMessage({text:JSON.stringify({'type':'chat'  ,
                                             'message':message,
                                            'displayName' : display_Name}
                                            )})
                                            addMessagetoDOM(display_Name , message)
e.target.reset()
}


let removeMemberfromDOM =async(MemberId)=>{
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
   let name = memberWrapper.getElementsByClassName('member_name')[0].textContent
   
    memberWrapper.remove()

    addBotMessagetoDOM(`${name} left`)
}
let leaveChannel = async()=>{
    await channel.leave()
    await rtmClient.logout()
}
window.addEventListener('beforeunload' , leaveChannel)

let messageform  = document.getElementById('message__form')
messageform.addEventListener('submit' , sendMessage)