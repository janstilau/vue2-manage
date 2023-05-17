import Vue from 'vue'
import Vuex from 'vuex'
import { getAdminInfo } from '@/api/getData'

Vue.use(Vuex)

// state 里面的内容, 会在 mapState 的时候, 暴露出去. 
const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
}

const mutations = {
	// 目前 saveAdminInfo 只有在 getAdminData 的时候, 被调用. 在这个工程里面, 其他的地方都没有触发这个函数.
	saveAdminInfo(state, adminInfo) {
		state.adminInfo = adminInfo;
	}
}

const actions = {
	async getAdminData({ commit }) {
		try {
			const res = await getAdminInfo()
			if (res.status == 1) {
				commit('saveAdminInfo', res.data);
			} else {
				throw new Error(res.type)
			}
		} catch (err) {
			console.log(err.message)
		}
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
