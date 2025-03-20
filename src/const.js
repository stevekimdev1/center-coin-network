export const serverUrl = 'http://localhost:8080';
export const mainUrl = 'http://localhost:8080';
export const websocketUrl = 'http://localhost:8080';
export const storageKeys = {
    accessToken: "centerNetwork:accessToken",
    refreshToken: "centerNetwork:refreshToken",
    returnUrl: "centerNetwork:returnUrl",
    user: 'centerNetwork:user',
    loginId: 'centerNetwork:loginId',
}

export const urls = {
    login: `${serverUrl}/auth/login`,
    refresh: `${serverUrl}/auth/refresh`,
}

export const getImageUrl = (idx) => {
    return `${serverUrl}/image/file/${idx}`;
}
