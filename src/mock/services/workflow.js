import Mock from 'mockjs2'
import { getQueryParameters } from '../util'

const titles = [
  'High Confidence Region Intergration',
  'RNAseq Variant Calling',
  'NGScheckMates',
  'Trimmomatic',
  'Fastqscreen',
  'concatVCF',
  'VQSR',
  'miRNAseq'
]

const descriptions = [
  '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
  '从RNAseq数据中call突变',
  '从fastq文件中判断样本间的关系',
  '',
  '',
  '',
  '',
  '用于miRNA-seq二代测序数据分析'
]

const avatar = ['https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'
]

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png'
]

const owner = [
  '付小小',
  '吴加好',
  '周星星',
  '林东东',
  '曲丽丽'
]

const progress = [
  {
    status: 'active',
    value: 99
  }, {
    status: 'success',
    value: 100
  }, {
    status: 'exception',
    value: 0
  }, {
    status: 'active',
    value: 30
  }, {
    status: 'exception',
    value: 30
  }, {
    status: 'success',
    value: 100
  }, {
    status: 'active',
    value: 10
  }, {
    status: 'success',
    value: 100
  }
]

const href = 'https://ant.design'

const workflow = (options) => {
  const queryParameters = getQueryParameters(options)
  console.log('queryParameters', queryParameters)
  if (queryParameters && !queryParameters.per_page) {
    queryParameters.per_page = 5
  } else {
    queryParameters.per_page = parseInt(queryParameters.per_page)
  }
  const data = []
  for (let i = 0; i < queryParameters.per_page; i++) {
    const tmpKey = i + 1
    const num = parseInt(Math.random() * (4 + 1), 10)
    data.push({
      id: tmpKey,
      avatar: avatar[num],
      owner: owner[num],
      href: href,
      title: titles[ i % 8 ],
      description: descriptions[ i % 8 ],
      startedAt: Mock.mock('@datetime'),
      finishedAt: Mock.mock('@datetime'),
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1'
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2'
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3'
        }
      ],
      progress: progress[ i % 8 ],
      report: tmpKey,
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)]
    })
  }

  const response = {
    total: data.length,
    per_page: parseInt(queryParameters.per_page),
    page: parseInt(queryParameters.page),
    message: 'success',
    data: data
  }
  return response
}

Mock.mock(/\/workflow/, 'get', workflow)