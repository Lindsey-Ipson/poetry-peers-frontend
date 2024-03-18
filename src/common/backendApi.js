import axios from "axios";

const BASE_URL = "http://localhost:3001";
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class BackendApi {
 
  static token;

  static async request (endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${BackendApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // User Methods

  static async getCurrentUser (username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async signup (data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  static async login (data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  static async updateProfile (username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  // Comment Methods

  static async addComment (data) {
    let res = await this.request(`comments`, data, "post");
    return res.comment;
  }

  static async getCommentsByTag ({ themeName, poemId, highlightedLines }) {
    const params = { themeName, poemId, highlightedLines: highlightedLines.join(",") };
    let res = await this.request(`comments/by-tag`, params, "get");
    return res.comments;
  }

  static async getCommentsByUsername (username) {
    let res = await this.request(`comments/by-user/${username}`, {}, "get");
    return res.comments;
  }

  // Poem Methods

  static async getPoemById (id) {
    let res = await this.request(`poems/${id}`);
    return res.poem;
  }

  static async addPoem (data) {
      let res = await this.request(`poems`, data, "post");
      return res.poem;
  }

  // Tag Methods

  static async addTag (data) {
      let res = await this.request("tags", data, "post");
      return res.tag;
  }

  static async getTagsByPoemId (poemId) {
      let res = await this.request(`tags/by-poem/${poemId}`);
      return res.tags;
  }

  static async getTagsByUsername (username) {
      let res = await this.request(`tags/by-user/${username}`);
      return res.tags;
  }
  
  // Theme Methods

  static async addTheme (data) {
      let res = await this.request("themes", data, "post");
      return res.theme;
  }

  static async getThemes (searchTerm) {
    const params = searchTerm ? { name: searchTerm } : {};
    let res = await this.request("themes", params, "get");
    return res.themes;
  }

}

export default BackendApi;
