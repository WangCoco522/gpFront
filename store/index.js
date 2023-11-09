import Vuex, { createStore } from 'vuex';


export default new Vuex.Store({
  state: {
    SensorMessageList: [],
    loading: false,
    error: null
  },
  mutations: {
      SET_LOADING(state, loading) {
          state.loading = loading;
      },
      SET_ERROR(state, error) {
          state.error = error;
      },
      // ... 其他 mutations
  },

  mutations: {
    SET_SENSOR_MESSAGE_LIST(state, data) {
      state.SensorMessageList = data;
    }
  },

  getters: {
    sensorMessageList: state => {
        return state.SensorMessageList;
    }
  },

  actions: {
    
    setSensorMessageList({ commit }, data) {
        commit('SET_SENSOR_MESSAGE_LIST', data);
    }
}
});
