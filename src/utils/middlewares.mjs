import {mockUsers} from "./constants.mjs"

//MiddleWare Function that validates user Index from request
export const resolveIndexByUserId = (request, response, next) => {
    const { 
        params: {id}
    } = request
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400) //400 - Bad Request
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return response.sendStatus(404) //404 - Not Found
    request.findUserIndex = findUserIndex
    next()
}
