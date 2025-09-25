const username = document.getElementById('username')
const email = document.getElementById('email')
const otherUsers_cont = document.getElementById("otherUsers_cont");
const messages_cont = document.getElementById("messages_cont");
const msg_user = document.getElementById("msg_user");
const conversation_msgs = document.getElementById("conversation_msgs");
const sendMsg_form = document.getElementById("sendMsg_form");
const send_btn = document.getElementById("send_btn");
const msg_inp = document.getElementById("msg");

const socket = io("http://localhost:5050");

socket.emit('home', sessionStorage.getItem('token'))

socket.on('hi', (data) => {
    console.log(data);
})


let user = {}
let otherUserId

const setLogedinUser = (userData) => {
    user = userData;
}

const getLogedinUser = () => {
    return user
}

const setOtherUserId = (userId) => {
    otherUserId = userId
}

const getOtherUserId = () => {
    return otherUserId
}

const getUser = async () => {
    const res = await axios.get("http://localhost:5050/user", {
        headers: {
            Authorization: `nagdy__${sessionStorage.getItem('token')}`
        }
    })

    if (res.data.message == "user data") {
        setLogedinUser(res.data.user);
        username.innerHTML = res.data.user.username
        email.innerHTML = res.data.user.email;
        document.title = res.data.user.username;
    }
}

getUser()


const getOtherUsers = async () => {
    
    const res = await axios.get("http://localhost:5050/user/otherUsers", {
        headers: {
            Authorization: `nagdy__${sessionStorage.getItem("token")}`
        }
    });

    const unRead_res = await axios.get("http://localhost:5050/message/unReadMessages", {
        headers: {
            Authorization: `nagdy__${sessionStorage.getItem("token")}`
        }
    });

    let unReadMessages = []

    if(unRead_res.data.message == 'conversation messages'){
        unReadMessages = unRead_res.data.messages;
        if(unReadMessages.length){
            document.title = `${document.title.split("(")[0]}(${unReadMessages.length})`;
        }
        else{
            document.title = document.title.split('(')[0];
        }
    }

    if (res.data.message == "otherUsers") {
        const otherUsers = res.data.otherUsers;
        
        if(otherUsers.length){
            const showOthers = otherUsers.map((val) => {
                const hasUnread = unReadMessages.some(msg => msg.senderId._id === val._id);
                
                return `
                    <div class="other_user d-flex flex-row justify-content-between align-items-center" data-id="${val._id}">
                        <h2 class="text-capitalize" >${val.username}</h2>
                        ${hasUnread ? '<i class="fa-solid fa-circle text-danger"></i>' : ''}
                    </div>
                `;
            }).join('')
            otherUsers_cont.classList.add("otherUsers_cont");
            otherUsers_cont.innerHTML = showOthers;
        }
    }
}

getOtherUsers()

let conv_res;

const showAllMessages = async () => {
    
    conv_res = await axios.get(
        `http://localhost:5050/conversation/${getOtherUserId()}`,
        {
            headers: {
                Authorization: `nagdy__${sessionStorage.getItem("token")}`,
            },
        }
    );

    if (conv_res.data.message == "conversation") {
        const msgs = await axios.get(
            `http://localhost:5050/message/allMessages/${conv_res.data.conversation._id}`,
            {
                headers: {
                    Authorization: `nagdy__${sessionStorage.getItem("token")}`,
                },
            }
        );

        const other_userInChat = await axios.get(
            `http://localhost:5050/user/${getOtherUserId()}`,
            {
                headers: {
                    Authorization: `nagdy__${sessionStorage.getItem("token")}`,
                },
            }
        );

        const msgs_show = msgs.data.messages.map((val) => {
            return val.senderId._id == getLogedinUser()._id
                ? `
                    <div class="msg-row left">
                        <div class="avatar">${val.senderId.username[0].toUpperCase()}</div>
                        <div class="bubble">
                            ${val.text}
                        </div>
                    </div>
            `
                : `
                <div class="msg-row right">
                    <div class="avatar">${other_userInChat.data.user.username[0].toUpperCase()}</div>
                    <div class="bubble">
                        ${val.text}
                    </div>
                </div>
            `;
        }).join('')

        conversation_msgs.innerHTML = msgs_show
        
    }

    else{
        conversation_msgs.innerHTML = '';
    }

};


// Get Other user info to show it in msg container

otherUsers_cont.addEventListener("click", async (e) => {
    const target = e.target.closest(".other_user");
    if (target) {
        msg_inp.value = "";
        const userId = target.dataset.id;
        setOtherUserId(userId)
        const res = await axios.get(`http://localhost:5050/user/${userId}`, {
            headers: {
                Authorization: `nagdy__${sessionStorage.getItem('token')}`
            }
        })

        if (res.data.message == "user") {
            msg_user.innerHTML = res.data.user.username
            msg_user.classList.add("msg_user");

            await showAllMessages();

            const readMsgs = await axios.patch(`http://localhost:5050/message/readMessage/${userId}`,{}, {
                headers: {
                    Authorization: `nagdy__${sessionStorage.getItem("token")}`,
                },
            });

            if(readMsgs.data.message == 'read messages'){
                socket.emit('readMessages', 'readMessages')
            }

            console.log(readMsgs.data);
            
            
            if (conv_res?.data?.conversation) {
                socket.emit("joinRoom", conv_res.data.conversation._id);
            }

            conversation_msgs.classList.remove('d-none')
            conversation_msgs.scrollTop = conversation_msgs.scrollHeight;
            sendMsg_form.classList.remove('d-none')
            send_btn.disabled = true;
            msg_inp.addEventListener("input", () => {
                send_btn.disabled = msg_inp.value.trim() === "";
            });
        }
    }
});

msg_inp.addEventListener("focus", async (e) => {
    socket.emit('readUser', getOtherUserId())
});


socket.on('newUser', (data) => {
    getOtherUsers()
});


send_btn.addEventListener('click', async () => {    
    const res = await axios.post("http://localhost:5050/conversation", 
        {
            type: "private",
            participants: [getLogedinUser()._id, getOtherUserId()],
        },
        {
            headers: {
                Authorization: `nagdy__${sessionStorage.getItem('token')}`
            }
        }
    );
    
    if (res.data.message == "Conversation Already Exist") {
        const msgRes = await axios.post(
            "http://localhost:5050/message",
            {
                conversationId: res.data.checkConversation._id,
                senderId: getLogedinUser()._id,
                receiverId: getOtherUserId(),
                text: msg_inp.value,
            },
            {
                headers: {
                    Authorization: `nagdy__${sessionStorage.getItem("token")}`,
                },
            }
        );

        if (msgRes.data.message == "msg sent") {
            socket.emit("sendMessage", res.data.checkConversation._id);
            socket.emit("sendMessageOtherUser", res.data.checkConversation._id);
            msg_inp.value = ''
        }
    } 
    
    else if (res.data.message == "Conversation Created") {
        socket.emit("joinRoom", res.data.conversation._id);

        const msgRes = await axios.post(
            "http://localhost:5050/message",
            {
                conversationId: res.data.conversation._id,
                senderId: getLogedinUser()._id,
                receiverId: getOtherUserId(),
                text: msg_inp.value,
            },
            {
                headers: {
                    Authorization: `nagdy__${sessionStorage.getItem("token")}`,
                },
            }
        );

        if (msgRes.data.message == "msg sent") {
            socket.emit("sendMessage", res.data.conversation._id);
            socket.emit("sendMessageOtherUser", res.data.conversation._id);
            msg_inp.value = "";
        }
    }

    socket.emit("newNoftication", {to: getOtherUserId(), from: getLogedinUser()._id});
})


socket.on("newMsg", async (data) => {
    await showAllMessages();
    await getOtherUsers();
    
});

socket.on("setRead", async (data) => {
    getOtherUsers();
});

socket.on("showNotification", async (data) => {
    await getOtherUsers()
});

socket.on("setReadUser", async (data) => {
    const readMsgs = await axios.patch(`http://localhost:5050/message/readMessage/${data}`,{}, {
        headers: {
            Authorization: `nagdy__${sessionStorage.getItem("token")}`,
        },
    });
    getOtherUsers();
});