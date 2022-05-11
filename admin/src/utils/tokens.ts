type Token = "accessToken" | "refreshToken";

export const tokens = {
  get: (key: Token) => {
    return localStorage.getItem(key);
  },
  update: (key: Token, value: string) => {
    return localStorage.setItem(key, value);
  },
  delete: (key: Token) => {
    localStorage.removeItem(key);
  }
};
