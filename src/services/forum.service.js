import http from "./main_service";

class ForumService {
    getAll() {
        return http.get(`forum/list-forum`);
    }

    get(id) {
        return http.get(`forum/view-forum`, {id: id});
    }

    create(data) {
        return http.post("/forum/create-forum", data);
    }

    update(data) {
        return http.post(`forum/update-forum`, data);
    }

    delete(id) {
        return http.post(`forum/delete-forum`, null, {id: id});
    }

    deleteAll() {
        return http.delete(`tutorials`);
    }

    findByTitle(title) {
        return http.get(`forum/list-forum`, {keyword: title});
    }

    listCategory() {
        return http.get(`main/forum-categories`);
    }
}

export default new ForumService();