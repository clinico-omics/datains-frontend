<template>
  <a-row class="pathology-model-container">
    <a-row class="title" v-if="title">{{ title }}</a-row>
    <a-row class="content">
      <a-tabs>
        <a-tab-pane :key="index" v-for="(item, index) in data" :tab="item.model">
          <a-row class="patient-info">
            <a-col :sm="24" :xs="24" :md="12" :lg="12" class="detail-info">
              <a-row class="title" style="padding-left: 0px">
                <span>Patient-level Results</span>
              </a-row>
              <a-row v-for="(value, key) in item.patient" :key="key" class="content">
                <a-col :sm="10" :xs="24" class="key">{{ formatKey(key) }}</a-col>
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    <span>{{ formatValue(key, value) }}</span>
                  </template>
                  <a-col :sm="14" :xs="24" class="value">{{ formatValue(key, value) }}</a-col>
                </a-tooltip>
              </a-row>
            </a-col>
            <a-col :sm="24" :xs="24" :md="12" :lg="12" class="data-info">
              <a-row class="title">Annotation</a-row>
              <a-row class="content">
                <p>{{ item.annotation }}</p>
              </a-row>
            </a-col>
          </a-row>
          <a-row class="patch-info">
            <a-row class="title">
              <span>Patch-level Results</span>
            </a-row>
            <a-row>
              <a-icon
                v-show="imageViewerVisible"
                class="close-btn"
                @click="hideImageViewer"
                theme="filled"
                type="close-circle"
              />
              <image-viewer ref="viewer" :zoomTo="3" class="image-viewer" v-show="imageViewerVisible"></image-viewer>
            </a-row>
            <vue-good-table
              class="vue-good-table"
              :search-options="{ enabled: true }"
              styleClass="vgt-table striped bordered condensed"
              :columns="genColumns(item.patch)"
              :rows="genRows(item.patch, format)"
              v-if="item.patch.length !== 0"
              @on-sort-change="onSortChange"
              @on-per-page-change="onPerPageChange"
              :pagination-options="paginationOptions"
              :line-numbers="true"
            >
              <template slot="table-row" slot-scope="props">
                <a
                  @click="showPatchImage(props.formattedRow[props.column.field], genImages(item.patch))"
                  v-if="props.column.field.indexOf('name') >= 0"
                >
                  {{ props.formattedRow[props.column.field] }}
                </a>
                <span v-else>{{ props.formattedRow[props.column.field] }}</span>
              </template>
            </vue-good-table>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-row>
  </a-row>
</template>

<script>
import v from 'voca'
import { VueGoodTable } from 'vue-good-table'
import sortBy from 'lodash.sortby'
import 'vue-good-table/dist/vue-good-table.css'
import { ImageViewer } from '@/components'
import { initBaseURL } from '@/config/defaultSettings'
import map from 'lodash.map'

export default {
  components: {
    VueGoodTable,
    ImageViewer
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    imageId: {
      type: String,
      required: true,
      default: 'FUSCCTNBC001'
    },
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      paginationOptions: {
        enabled: true,
        mode: 'records',
        perPage: 10,
        position: 'top',
        perPageDropdown: [10, 20, 30, 50, 100],
        dropdownAllowAll: false,
        setCurrentPage: 1,
        nextLabel: 'next',
        prevLabel: 'prev',
        rowsPerPageLabel: 'Rows per page',
        ofLabel: 'of',
        pageLabel: 'page', // for 'pages' mode
        allLabel: 'All'
      },
      keyMap: {
        name: 0,
        prediction: 1,
        score: 2
      },
      imageViewerVisible: false
    }
  },
  methods: {
    onSortChange(params) {
      this.$emit('sort-column', params)
    },
    onPerPageChange(params) {
      this.paginationOptions.perPage = params.currentPerPage
    },
    showPatchImage(patchId, images) {
      this.imageViewerVisible = true
      const index = images.findIndex(image => {
        return image.title === patchId
      })

      const end = images.length > this.paginationOptions.perPage ? this.paginationOptions.perPage : images.length
      this.$refs.viewer[0].show(images.slice(0, end), index)
    },
    hideImageViewer() {
      this.imageViewerVisible = false
    },
    formatPrediction(value) {
      if (value === 1) {
        return 'Mutated'
      } else if (value === 0) {
        return 'Non Mutated'
      }
    },
    format(record) {
      if (typeof record.prediction === 'number') {
        console.log('Format: ', record.prediction, typeof record.prediction)
        record.prediction = this.formatPrediction(record.prediction)
      }

      if (record.score) {
        record.score = Number(Number.parseFloat(record.score).toFixed(3))
      }
    },
    formatKey(key) {
      const formattedKey = key.replace(/([A-Z])/g, ' $1')
      const newKey = v.titleCase(formattedKey.split('_').join(' '))
      if (newKey === 'Score') {
        return 'Predicted Probability'
      } else if (newKey === 'Prediction') {
        return 'Binarized Prediction'
      } else {
        return newKey
      }
    },
    isFloat(n) {
      return Number(n) === n && n % 1 !== 0
    },
    formatValue(key, value) {
      let formatedValue = ''
      if (this.isFloat(value)) {
        formatedValue = value.toFixed(3)
      } else {
        formatedValue = value
      }

      if (key === 'prediction') {
        return this.formatPrediction(formatedValue)
      } else {
        return formatedValue
      }
    },
    genImages(rows) {
      const baseApiUrl = initBaseURL()
      return map(rows, row => {
        return {
          description: row.name,
          title: row.name,
          source: `${baseApiUrl}/attachments/pathology/${this.imageId}_models/norm_patches/${row.name}`
        }
      })
    },
    sortFn(x, y, col, rowX, rowY) {
      // x - row1 value for column
      // y - row2 value for column
      // col - column being sorted
      // rowX - row object for row1
      // rowY - row object for row2
      return x < y ? -1 : x > y ? 1 : 0
    },
    whichOrder(key) {
      return this.keyMap[key]
    },
    genColumns(rows) {
      var columns = []
      if (rows.length > 0) {
        const record = rows[0]
        for (const [key, value] of Object.entries(record)) {
          let config = {
            label: this.formatKey(key),
            // label: key,
            field: key,
            order: this.whichOrder(key),
            sortable: true,
            width: '180px',
            tdClass: 'text-center',
            thClass: 'text-center'
          }

          if (typeof record[key] === 'number') {
            config['sortFn'] = this.sortFn
          }

          columns.push(config)
        }
      }

      return sortBy(columns, o => {
        return o.order
      })
    },
    genRows(rows, format) {
      for (let row of rows) {
        format(row)
      }

      return rows
    }
  }
}
</script>

<style lang="less" scoped>
.pathology-model-container {
  width: 100%;
  height: 100%;
  background-color: #fff;

  .title {
    font-size: 16px;
    background-color: #fff;
    color: #6b6262;
    padding: 10px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 1px solid #d9d9d9;
  }

  .content {
    padding: 0px 10px 10px;

    .patient-info {
      display: flex;
      flex-direction: row;
      margin: 10px 0px;
      border-radius: 5px;
      border: 1px solid #d9d9d9;

      .detail-info {
        margin-right: 10px;
      }

      .detail-info,
      .data-info {
        width: calc(50% - 5px);
        background-color: #fff;
        font-size: 15px;
        border-radius: 5px;

        .key {
          // font-weight: 450;
        }

        .value {
          text-overflow: ellipsis;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
        }

        .ant-row {
          padding: 5px 10px;
          margin: 5px 10px;
        }

        .content.ant-row:nth-child(even) {
          // 利用css选择器，偶数列增加背景色
          background: #e8f4ff;
        }

        .title {
          padding: 10px 0px;
          font-size: 16px;
          margin-bottom: 10px;
          color: #6b6262;
          border-bottom: 1px solid #d9d9d9;
        }
      }
    }

    .patch-info {
      display: flex;
      flex-direction: column;
      margin: 10px 0px;
      border-radius: 5px;

      .title {
        border: 1px solid #d9d9d9;
        border-bottom: unset;
      }
    }
  }

  .close-btn {
    z-index: 10;
    font-size: 16px;
    position: absolute;
    top: 5px;
    left: 5px;
  }

  .image-viewer {
    height: 450px;
    margin-bottom: 10px;
  }
}
</style>

<style lang="less">
.pathology-model-container {
  .ant-tabs-bar {
    margin: 0px;
  }
}
</style>
