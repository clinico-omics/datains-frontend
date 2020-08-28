import {
  getAppList,
  getAppManifest,
  getInstalledAppList,
  getAppSchema,
  getHelpMsg,
  getToolManifest,
  getToolSchema
} from '@/api/manage'
import orderBy from 'lodash.orderby'
import { reject } from 'core-js/fn/promise'

const formatRecords = function(records) {
  const newRecords = []
  for (const record of records) {
    newRecords.push({
      id: record.id,
      title: record.title,
      description: record.description,
      repoUrl: record.repo_url,
      cover: record.cover,
      author: record.author,
      icon: record.icon,
      rate: record.rate,
      valid: record.valid
    })
  }

  return newRecords
}

const formatInstalledApps = function(installedApps) {
  const newRecords = []

  for (const record of installedApps) {
    newRecords.push({
      id: record.id,
      name: record.name
    })
  }

  return orderBy(newRecords, 'name', 'desc')
}

const formatManifest = function(manifest) {
  const newRecords = []

  for (const record of manifest) {
    newRecords.push({
      id: record.id,
      title: record.name,
      shortName: record.short_name,
      appName: record.app_name,
      home: record.home,
      hidden: record.hidden,
      author: record.author,
      description: record.description,
      icons: record.icons,
      category: record.category,
      source: record.source
    })
  }

  return orderBy(newRecords, 'title', 'desc')
}

const app = {
  state: {
    appList: [],
    installedAppList: {}
  },

  mutations: {
    SET_APP_LIST: (state, appList) => {
      state.appList = appList
    },
    SET_INSTALLED_APP_LIST: (state, installedAppList) => {
      state.installedAppList = installedAppList
    }
  },

  actions: {
    GetAppList({ commit }, parameter) {
      return new Promise((resolve, reject) => {
        getAppList(parameter)
          .then(response => {
            console.log('GetAppList: ', parameter, response)

            const data = {
              perPage: response['per_page'],
              page: response['page'],
              total: response['total'],
              data: formatRecords(response.data)
            }
            commit('SET_APP_LIST', data)

            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetAppManifest({ commit }, parameter) {
      return new Promise((resolve, reject) => {
        getAppManifest(parameter)
          .then(response => {
            console.log('GetAppManifest: ', parameter, response)

            const data = {
              total: response['total'],
              data: formatManifest(response.data)
            }

            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetToolManifest({ commit }, parameter) {
      return new Promise((resolve, reject) => {
        getToolManifest(parameter)
          .then(response => {
            console.log('GetToolManifest: ', parameter, response)

            const data = {
              total: response.length,
              data: formatManifest(response)
            }

            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetToolSchema({ commit }, parameter) {
      return new Promise((resolve, reject) => {
        getToolSchema(parameter)
          .then(response => {
            console.log('GetToolSchema: ', parameter, response)

            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetInstalledAppList({ commit }, parameter) {
      return new Promise((resolve, reject) => {
        getInstalledAppList(parameter)
          .then(response => {
            console.log('GetInstalledAppList: ', parameter, response)

            const data = {
              perPage: response['per_page'],
              page: response['page'],
              total: response['total'],
              data: formatInstalledApps(response.data)
            }
            commit('SET_INSTALLED_APP_LIST', data)

            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetAppSchema({ commit }, appName) {
      return new Promise((resolve, reject) => {
        getAppSchema(appName)
          .then(response => {
            console.log('GetAppSchema: ', appName, response)

            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetHelpMsg({ commit }, appName) {
      return new Promise((resolve, reject) => {
        getHelpMsg(appName)
          .then(response => {
            console.log('GetHelpMsg: ', appName, response)

            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default app
