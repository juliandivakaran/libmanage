import axios from "axios";

const baseUrl = "http://localhost:5213/todos";

export default {
  dCandidate(url = baseUrl) {
    return {
      fetchAll: () => axios.get(url),
      fetchById: (id, number) => axios.get(url + "/" + id),
      create: (newRecord) => axios.post(url, newRecord),
      update: (id, updateRecord) => axios.put(url + "/" + id, updateRecord),
      remove: (id) => axios.delete(url + "/" + id) // Renamed 'delete' to 'remove'
    };
  }
};
