<template>
  <div class="info">
    <!-- 背景图片 -->
    <div class="header_image"></div>
    <!-- 内容区域 -->
    <div class="body_table">
      <div class="btn_bar">
        <el-button @click="handleTableExport" class="out-button" type="primary" plain :loading="temporaryLoading">导出
        </el-button>
        <div style="display: inline;" v-if="userType === 'SHIPOWNER'">
          <el-button type="primary" :loading="temporaryLoading" @click="temporaryStorage" plain v-show="false">暂存
          </el-button>
          <el-button type="primary" plain :loading="submitLoading" @click="submit">提交</el-button>
          <el-upload class="file_upload" action="/files" :before-upload="beforeUpload" list-type="text">
            <el-button size="small" type="primary" @click="open4">上传附件</el-button>
            <div class="el-upload__tip"><span>{{fits}}</span></div>
          </el-upload>

          <div class="fl">
            <span class="cm">进入特战区时间</span>
            <el-date-picker v-model="searchTime" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" @click="searchByTime">搜索</el-button>
          </div>
        </div>
      </div>
      <el-table id="detailTeble" :data="tableData" :default-expand-all="expandAll" @select="handleSelectionChange"
        @select-all="handleSelectAll" @row-click="showHide" :row-class-name="switchRowClass" :empty-text="emptyText"
        v-loading="loading" ref="tableMain" style="width: 100%;font-size:12px;padding-left:20px">
        <el-table-column type="selection" width="45">
        </el-table-column>
        <el-table-column width="25" type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.orderDtos" border :cell-style="tableRowClassName"
              style="width: 100%;font-size:12px">
              <el-table-column width="120px" prop="throughArea" label="特战区域名称">
              </el-table-column>
              <el-table-column prop="intime_ext" width="100px" label="进入时间">
              </el-table-column>
              <el-table-column prop="outtime_ext" width="100px" label="离开时间">
              </el-table-column>
              <el-table-column prop="days" label="停留天数">
              </el-table-column>
              <el-table-column prop="loadInfo" label="空满载">
                <template slot-scope="scope">
                  <el-radio v-model="scope.row.loadInfo" label="满载">满载</el-radio>
                  <el-radio v-model="scope.row.loadInfo" label="空载">空载</el-radio>
                </template>
              </el-table-column>
              <el-table-column width="120px" prop="anchoragePort" label="挂靠特战区港口">
              </el-table-column>
              <el-table-column prop="anchorageDate" label="挂靠时间">
              </el-table-column>
              <el-table-column label="安保人数">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.guardsNo" placeholder="请选择">
                    <el-option v-for="todos in guardList" :key="todos.length" :label="todos.value" :value="todos.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="K&R">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.karAmount" placeholder="请选择">
                    <el-option v-for="todos in KidnapList" :key="todos.length" :label="todos.value"
                      :value="todos.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column label="船名" width="90px" prop="shipCName">
        </el-table-column>
        <el-table-column label="航次" align='center' width="70px" prop="line">
          <template scope="scope">
            <el-button type="text" style="color:#606266" @click="toogleExpand(scope.row)">
              <span class="line-class" @click="clickLine(scope.row)">{{scope.row.line}}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="出发港/出发时间" align='center' prop="departurePort">
          <template slot-scope="scope">
            <span>{{ scope.row.departurePort }}</span><br>
            <span>{{scope.row.etd}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="出发时间" width="90px" prop="etd_ext">
        </el-table-column> -->
        <el-table-column label="目的港/到达时间" align='center' prop="arrivalPort">
          <template slot-scope="scope">
            <span>{{ scope.row.arrivalPort }}</span><br>
            <span>{{scope.row.eta}}</span>
          </template>
        </el-table-column>
        <el-table-column label="特战区" width="100px" prop="throughAreaSum">
          <template scope="scope">{{scope.row.throughAreaSum}}</template>
        </el-table-column>
        <el-table-column label="天数" width="60px" prop="daysPlus">
          <template scope="scope">
            <el-button type="text" style="color:#606266" @click="toogleExpand(scope.row)">
              {{scope.row.daysPlus}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column  label="挂靠港" align='center' prop="ports">
        </el-table-column>
        <el-table-column prop="insuranceAmountCurrency" align='center' width="135px" label="保险金额">
          <template scope="scope">{{scope.row.insuranceAmountCurrency}}</template>
        </el-table-column>
        <el-table-column label="无需申报" v-if="userType === 'SHIPOWNER'">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.needDeclare" active-value="0" inactive-value="1" active-color="#13ce66"
              inactive-color="#888">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="block page_div">
        <el-pagination @size-change="getTableData" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-size="pageSize" layout="total,prev,pager,next,slot,jumper" :total="totalNum">
          <span class="button_last_page" @click="handleGotoLastPage">尾页</span>
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import dateFormat from 'dateformat'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import {
    getOrderList
  } from '@/api/order'
  export default {
    data() {
      return {
        isShow: false,
        isExpand: true,
        loading: true,
        allData: [],
        enheng: true,
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        selectAll: true,

        // selectAll: true,
        emptyText: '加载中',
        KidnapList: [{
            value: '0',
            label: '0'
          },
          {
            value: '5,000,000',
            label: '5,000,000'
          },
          {
            value: '8,000,000',
            label: '8,000,000'
          }, {
            value: '10,000,000',
            label: '10,000,000'
          }
        ],
        guardList: [{
          value: '0',
          label: '0'
        }, {
          value: '2',
          label: '2'
        }, {
          value: '3',
          label: '3'
        }, {
          value: '>3',
          label: '>3'
        }
      ],
        userType: null,
        select: '',
        fileName: '',
        fits: null,
        searchTime: '',
        temporaryLoading: false,
        submitLoading: false
      }
    },
    computed: {
      expandAll() {
        return localStorage.getItem('currentUser').userCode === '9999218600'
      }
    },
    methods: {
     
      /**
       * 导出
       */
      handleTableExport() {
          let reqUrl = ''
          if(this.searchTime && this.searchTime.length >= 2){
            let startDate = dateFormat(this.searchTime[0], "yyyy-mm-dd")
            let endDate = dateFormat(this.searchTime[1], "yyyy-mm-dd")
            reqUrl = `/files/exportVoyageList?startDate=${startDate}&endDate=${endDate}`;
          }else{
           reqUrl = '/files/exportVoyageList'
          }

          this.$http({
            method: 'get',
            url: reqUrl,
            responseType: 'blob'
          }).then(response => {
            const file = response.headers['content-disposition']
            let filename = file.split('=')[1];
            this.download(response.data, filename)
          }).catch(error => {
            this.$message.error('导出错误！');
          })
      },

      // 手动下载 手动创建a标签,并触发点击下载
      download(data, file) {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', file)
        document.body.appendChild(link)
        link.click()
      },



      showHide(row, column, e) {
        if (column.label === '无需申报') {
          return;
        }
        this.$refs.tableMain.toggleRowExpansion(row)
      },
      toogleExpand(row) {
        let $table = this.$refs.tableMain;
        this.tableData.map((item) => {
          if (row.id != item.id) {
            $table.toggleRowExpansion(item, false)
          }
        })
        $table.toggleRowExpansion(row)
      },
      switchRowClass({
        row
      }) {
        if (!row.line) {
          return "row_no_line"
        }
        return ""
      },
      handleSelectionChange(value, row) {
        row.selected = !row.selected;
      },
      temporaryStorage() {
        if (this.temporaryLoading) {
          return;
        }
        this.temporaryLoading = true;

        let selectedData = this.allData.filter(t => t.selected)
        if (selectedData.length > 0) {
          let proms = {
            list: selectedData
          }
          this.$http.post('/shiper/HoldInsuranceOrders', proms).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '暂存成功',
                type: 'success'
              })
              this.fits = ""
            }
            this.temporaryLoading = false;
          })
        } else {
          this.temporaryLoading = false;
          this.$message({
            message: '请选择暂存内容',
            type: 'warning'
          })
        }
      },
      submit() {
        if (this.submitLoading) {
          return;
        }
        this.submitLoading = true;

        let selectedData = this.allData.filter(t => t.selected)
        if (selectedData.length > 0) {
          let obj = {
            batchNum: '',
            status: '',
            premium: '',
            fileName: this.fileName,
            fileId: this.fileId
          }
          let promst = {
            batch: obj,
            list: selectedData
          }
          this.$http.post('/shiper/saveInsuranceOrders', promst).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.allData = []
              this.getTableData()
              this.fits = ""
            }
            this.submitLoading = false;
          })
        } else {
          this.submitLoading = false;
          this.$message({
            message: '请选择提交内容',
            type: 'warning'
          })
        }
      },

      beforeUpload(file) {
        let fd = new FormData()
        fd.append('file', file) // 传文件
        fd.append('fileName', encodeURI(file.name))
        this.$http.post('/files/save', fd).then(res => {
          if (res.status === 200) {
            if (!this.fits) {
              this.$message({
                type: 'success',
                message: '上传成功   下一次上传将会覆盖此文件'
              })
            } else {
              this.$message({
                type: 'success',
                message: '覆盖成功'
              })
            }
            this.fileId = res.data
            this.fileName = file.name
            this.fits = '附件:' + file.name
          }
        })
      },
      handleSelectAll() {
        // 如果存在未选择的全选
        if (!this.tableData.some(t => t.selected)) {
          this.allData.forEach(t => t.selected = true)
        } else {
          this.allData.forEach(t => t.selected = false)
        }
        this.toggleSelection(this.tableData)
      },
      tableRowClassName(row) {
        if (row.row.throughArea === '印度洋') {
          return 'background: oldlace'
        } else if (row.row.throughArea === '亚丁湾') {
          return 'background: oldlace'
        } else {
          return ''
        }
      },
      handleGotoLastPage() {
        let lastPage = Math.ceil(this.totalNum / this.pageSize)
        this.handleCurrentChange(lastPage)

      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getTableData()
      },
      getsum(arr, d) {
        let sum = '';
        // console.log(666888);
        for (let j = 0; j < arr.length - 1; j++) {
          let throughAreaList = arr[j].split(',');
          for (let k of throughAreaList) {
            // console.log(k)
            sum += k + "\n";
            d['throughAreaSum'] = sum;
          }
          // return d['throughAreaSum'];
        }
        // return d['throughAreaSum'];
      },

      // 点击航次跳转到地图页，查看当前船舶的航迹信息
      clickLine(row) {
        this.storage.clickLine(row);
      },

      getTableData(params, sum) {
        this.loading = true;
        if (this.allData && this.allData.length > 0 && !params) {
          this.tableData = this.allData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)

          this.$nextTick(() => {
            this.toggleSelection(this.tableData)
          })
          this.loading = false
        } else {


          getOrderList(params).then(res => {
            console.log('aa')
            //千分位 特战区 总时间
            for (let d of res.data.list) {
              let plus = 0;
              let arr = [];
              for (let i of d['orderDtos']) {
                if (!arr.includes(i.throughArea)) {
                  arr.push(i.throughArea);
                }
                // 天数
                plus += Number(i.days);
                d['daysPlus'] = plus.toFixed(2);
                if (i['intime']) {
                  i['intime_ext'] = i['intime'].replace(' ', '\n')
                }
                if (i['outtime']) {
                  i['outtime_ext'] = i['outtime'].replace(' ', '\n')
                }
              }
              d.throughAreaSum = arr.join('\n')

              if (d['insuranceAmount']) {
                // 保险金额
                var amountStr = d['insuranceAmount'].replace(/\s*/g, "");
                d['insuranceAmountCurrency'] = d['currency'] + '\n' + (amountStr.replace(/(\d)(?=(?:\d{3})+$)/g,
                  '$1,'));
              } else {
                d['insuranceAmountCurrency'] = ''
              }
              if (d['eta']) {
                d['eta_ext'] = d['eta'].replace(' ', '\n')
              }
              if (d['etd']) {
                d['etd_ext'] = d['etd'].replace(' ', '\n')
              }
            }

            this.allData = res.data.list

            if (!(this.allData && this.allData.length > 0)) {
              this.emptyText = '暂无数据'
            }
            this.tableData = this.allData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
              .pageSize)
            console.log(this.tableData)
            // 新增一个属性,标识数据的选中状态
            this.allData.forEach(e => e.selected = true)
            this.totalNum = this.allData.length
            this.$nextTick(() => {
              this.toggleSelection(this.tableData)
            })
            this.loading = false
          })
        }
      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.tableMain.toggleRowSelection(row, row.selected)
          })
        }
      },
      searchByTime() {
        this.currentPage = 1;
        if (this.searchTime && this.searchTime.length >= 2) {
          let startDate = dateFormat(this.searchTime[0], "yyyy-mm-dd")
          let endDate = dateFormat(this.searchTime[1], "yyyy-mm-dd")
          this.getTableData({
            startDate,
            endDate
          })
        } else {
          this.getTableData({})
        }
      },
      async getBatchList(batchNum = '', createBy = '', status = '', page = 1) {
        //船东用户，获取是否存在退回数据，如果有退回数据则弹框提示
        let res = await this.$http.get('/shiper/batchList', {
          params: {
            batchNum,
            createBy,
            status,
            num: 10,
            page
          }
        })
        if ((res.status === 200) && (res.data.total > 0)) {
          this.popupDialog(res.data.total, status);
        }
      },
      popupDialog(count, status) {
        sessionStorage.setItem("shipOwnerTipDialog", "tip");
        let msg = "存在" + count + "个退回的批次，是否现在处理？";
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确定
          this.$router.push({
            name: 'batch',
            params: {
              status: status
            }
          })
        }).catch(() => {
          //取消
        });
      }
    },
    created() {
      this.userType = localStorage.getItem('nametype')
      this.getTableData()

      let tipDialog = sessionStorage.getItem("shipOwnerTipDialog");
      //船东用户，获取是否存在退回数据，如果有退回数据则弹框提示
      if ((this.userType === 'SHIPOWNER') && (tipDialog === '')) {
        this.getBatchList('', '', '2', 1);
      }
    }
  }
</script>
<style lang="postcss" scoped>
  /* variables */
  $maxWidth: 1200px;

  .out-button {
    margin-left: 15px;
  }

  .el-button {
    height: 40px;
  }

  .info {
    width: 100%;
    height: 100%;
    background-color: #f5f5f6;

    .header_image {
      width: 100%;
      height: 200px;
      background-size: 100% 100%;
      background-image: resolve('tzxbgc.png');
      margin: 0 auto;
    }

    .body_table {
      width: $maxWidth;
      margin: 0 auto;
      box-sizing: border-box;
      padding-top: 10px;
    }

  }

  .body_table {
    background-color: #ffffff;
    padding: 0 15px;

    .btn_bar {
      width: 100%;
      height: 60px;
      padding: 5px;
      box-sizing: border-box;
    }

    .file_upload {
      display: inline-block;
      /* margin-left: 50px; */
    }
  }

  .fl {
    float: right;
  }

  .cm {
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
  }

  .title_ipt {
    width: 1200px;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    margin-top: 10px;
    padding: 0 23px;
    box-sizing: border-box;
  }

  .inpt_width {
    width: 200px;
  }

  .sele_width {
    width: 150px;
  }

  .maleft {
    margin-left: 20px;
  }

  .btns {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    box-sizing: border-box;
    padding-left: 40px;
    position: relative;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .nonde {
    display: none;
  }

  .form_posi {
    position: absolute;
    top: 0px;
    left: 300px;
  }

  .el-upload__tip {
    float: right;
    margin-top: 0;
    margin-left: 8px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }

  .page_div {
    text-align: right
  }

  .button_last_page {
    display: block;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  a {
    /* text-decoration: none; */
  }

  .el-table__body,
  .el-table__footer,
  .el-table__header {
    margin: 0 auto;
  }
</style>
<style type="text/css">
  .row_no_line {
    background-color: #5cafe0 !important;
  }

  .el-table .cell {
    white-space: pre-line;
  }
</style>

<style scoped>

</style>