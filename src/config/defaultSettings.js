/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export const config = {
  primaryColor: '#2F54EB', // primary color of ant design
  navTheme: 'light', // theme for nav menu
  layout: 'topmenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  hiddenHeader: false, // Hide header
  fixedHeader: true, // sticky header
  fixSiderbar: false, // sticky siderbar
  autoHideHeader: true, //  auto hide header
  colorWeak: false,
  multiTab: false,
  // eslint-disable-next-line
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
  // vue-ls options
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  },
  initialComponentSettings: {
    disabledContextMenu: 'true',
    disabledExploratory: 'true',
    dashboardName: 'QuartetDashboard'
  },
  domTitle: 'The ClinicoOmics Platform',
  // eslint-disable-next-line no-undef
  websiteLogo: require('@/assets/logo.png'),
  websiteName: 'ClinicoOmics',
  websiteId: 'clinicoomics',
  noPermission: false,
  websiteDesc: 'The ClinicoOmics Platform for Clinico OMICS & BioMedGPS'
}

export function getDnaHost() {
  const hostname = window.location.hostname
  if (hostname == 'pgx.fudan.edu.cn') {
    return 'http://pgx.fudan.edu.cn/dnaseq/'
  } else {
    return 'http://10.157.72.56:8081/quartet-dna-vis/'
  }
}

export function getRnaHost() {
  const hostname = window.location.hostname
  if (hostname == 'pgx.fudan.edu.cn') {
    return 'http://pgx.fudan.edu.cn/rnaseq/'
  } else {
    return 'http://10.157.72.56:8081/quartet-rna-vis/'
  }
}

// SeqFlow
export function initSeqFlowHost() {
  const seqFlowHost = localStorage.getItem('seqFlowHost')
  console.log(`SEQ_FLOW_HOST: ${seqFlowHost}`)

  const hostname = window.location.hostname
  if (hostname == 'pgx.fudan.edu.cn') {
    return 'http://pgx.fudan.edu.cn/seqflow'
  }

  return seqFlowHost || 'http://10.157.72.54/datains'
}

// BASE_API
export function initBaseURL() {
  const apiService = 'http://10.157.72.54'
  console.log(`BASE_API_URL: ${apiService}`)
  return apiService
}

// TService
export function initTServiceHost() {
  const tServiceHost = localStorage.getItem('tServiceHost')
  console.log(`TSERVICE_HOST: ${tServiceHost}`)

  const hostname = window.location.hostname
  if (hostname == 'pgx.fudan.edu.cn') {
    return 'http://pgx.fudan.edu.cn/tservice'
  }

  return tServiceHost || 'http://10.157.72.54/tservice'
}

// DataSeq
export function initDataSeqHost() {
  const dataSeqHost = localStorage.getItem('dataSeqHost')
  console.log(`DATA_SEQ_HOST: ${dataSeqHost}`)

  const hostname = window.location.hostname
  if (hostname == 'pgx.fudan.edu.cn') {
    return 'http://pgx.fudan.edu.cn/dataseq'
  }

  return dataSeqHost || 'http://10.157.72.54/dataseq'
}

// Component Settings
export function initComponentSettings() {
  let componentSettings = JSON.parse(localStorage.getItem('componentSettings'))
  console.log(`Component Settings(initComponentSettings): ${componentSettings}`)

  if (componentSettings == undefined) {
    componentSettings = {}
  }

  return Object.assign(config.initialComponentSettings, componentSettings)
}

// -------------------------------------------------

export const domTitle = config.domTitle

export const websiteName = config.websiteName

export const websiteLogo = config.websiteLogo

export const websiteDesc = config.websiteDesc

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9
    ? 'Good Morning'
    : hour <= 11
    ? 'Good Morning'
    : hour <= 13
    ? 'Good Afternoon'
    : hour < 20
    ? 'Good Afternoon'
    : 'Good Evening'
}

export function saveSeqFlowHost(seqFlowHost) {
  localStorage.setItem('seqFlowHost', seqFlowHost)
}

export function saveTServiceHost(tServiceHost) {
  localStorage.setItem('tServiceHost', tServiceHost)
}

export function saveDataSeqHost(dataSeqHost) {
  localStorage.setItem('dataSeqHost', dataSeqHost)
}

export function saveComponentSettings(componentSettings) {
  localStorage.setItem('componentSettings', JSON.stringify(componentSettings))
}

export function welcome() {
  const arr = []
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}
