import Avatar from "@mui/material/Avatar";
import utils from "../../../pages/auth/utils";
import axios from "axios";
let Token = localStorage.getItem("token");

export const getGroupData = async () => {
    return await axios
        .get(`${utils.getHost()}/chat/get/user_connected_list/`, {
            headers: {
                Authorization: `Bearer ${Token}`,
            },
        })
};

export const getChannelMessage = async (chatroomId, page = 1) => {
    return await axios
        .get(
            `${utils.getHost()}/chat/get/channel/paginated_messages/?channel=${chatroomId}&records=10&p=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }
        )
}

export const getUserMessage = async (chatroomId, page = 1) => {
    return await axios
        .get(
            `${utils.getHost()}/chat/get/user/paginated_messages/?user=${chatroomId}&records=10&p=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }
        )
}

export const DisplaySearchUser = async (inputSearch) => {
    return await axios
        .get(`${utils.getHost()}/chat/get/user_connected_list/?search=${inputSearch}`, {
            headers: {
                Authorization: `Bearer ${Token}`,
            },
        })
        .then((response) => {
            const groups = response.data;
            const prevGroup = [];
            const temp = groups.results.length;
            for (let i = 0; i < temp; i++) {
                if (groups.results[i].type === "Channel") {
                    const receivedObj = groups?.results[i].Channel;
                    prevGroup.push({
                        // id: i,
                        id: receivedObj?.id,
                        name: receivedObj?.name,
                        created_at: receivedObj?.created_at,
                        typeId: receivedObj?.id,
                        image: receivedObj?.image || Avatar,
                        type: "Channel",
                        isConnected: groups?.results[i].designation,
                        about: receivedObj?.about,
                    });
                } else {
                    const receivedObj = groups?.results[i]?.user;
                    // if (login_user?.username !== receivedObj?.username) {
                    prevGroup.push({
                        // id: i,
                        id: receivedObj?.id,
                        name: receivedObj?.username,
                        created_at: receivedObj?.created_at,
                        typeId: receivedObj?.id,
                        image: groups.results[i]?.user_profile?.image || Avatar,
                        type: "user",
                        isConnected: 0,
                        about: groups.results[i]?.user_profile?.about,
                    });
                    // }
                }
            }
            console.log(prevGroup);
            return [...prevGroup]
        }).catch((error) => {
            console.log(error);
            return []

        })


}
