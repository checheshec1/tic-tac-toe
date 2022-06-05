export const REGISTRATION_ROUTE = "/registration"
export const LOGIN_ROUTE = "/login"
export const MAIN_ROUTE = "/lobby"
export const GAME_ROUTE = "/room/"
export const START_ROUTE = "/"
export const SELECT_ROUTE = "/selectRoom"
export const CREATE_ROOM = "/createRoom"

export function isValid(value) {
    return value.length >= 8
}