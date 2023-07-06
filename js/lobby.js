
let form = document.getElementById("lobby__form")


function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
let roomIDBOX  = document.getElementById("roomid")

let printRoomId = ()=>{
    const uuis = generateUUID();
    console.log(uuis);
    roomIDBOX.value=uuis
}
document.getElementById('rid-btn').addEventListener('click' , printRoomId)
let displayName = sessionStorage.getItem("displayName")
form.addEventListener('submit',(e)=>{

        e.preventDefault()
        sessionStorage.setItem("displayName" , e.target.name.value)

       const rid = e.target.room.value
        window.location  =`room.html?room=${rid}`
        window.localStorage.setItem('roomID' , rid)



})