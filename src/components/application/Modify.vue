<template>
  <div class="info">
    <!-- 头部背景图片 -->
    <div class="logo_bgc"
         :style="bgc"></div>
    <div class="logo_botton">
      <div class="btnxz">
        <el-button type="primary"
                   class="left_button"
                   @click="isLoad(item.fileId)" :disabled="!item.fileId">下载附件</el-button>
        <el-button type="primary"
                   class="left_button"
                   @click="isExport(item.uuid, item.batchNum)">导出excel</el-button>
        <el-button type="primary"
                   class="left_button"
                   @click="isFu">返回</el-button>
        <el-form class="left_button"
                 v-if="nameType === 'SHIPOWNER' &&item.status === '2' ">
          <el-upload class="upload-demo"
                     action="/files"
                     :before-upload="beforeUpload"
                     list-type="text">
            <el-button type="primary">上传附件</el-button>
          </el-upload>
        </el-form>
        <el-button type="primary"
                   class="right_button"
                   v-if="nameType === 'BROKER'  && item.status === '0'"
                   :disabled='!disabled'
                   @click="isReturns">退回</el-button>
        <el-button :type="primarys"
                   class="right_button"
                   v-if="nameType === 'BROKER'  && item.status === '0'"
                   :disabled='disabled'
                   @click="isPass">审核通过</el-button>
        <el-button type="primary"
                   v-if="nameType === 'SHIPOWNER' && item.status === '2' "
                   @click="isSubmission"
                   class="right_button">提交</el-button>
        <span>&nbsp;&nbsp;&nbsp;附件:{{item.fileName}}</span>
      </div>
      <div class="title_s">
        <div class="fdsa">
          <span class="ml10">申报批次：</span>
          <span>{{item.batchNum}}</span>
        </div>
        <div class="fdsa">
          <span class="ml10">申报公司：</span>
          <span>{{item.createby}}</span>
        </div>
        <div class="fdsa">
          <span class="ml10">申报时间：</span>
          <span>{{item.createtime}}</span>
        </div>
        <div class="fdsa">
          <span class="ml10">申报状态：</span>
          <div v-if="item.status === '0'"
               class="dsh">待审核</div>
          <div v-else-if="item.status === '1'"
               class="ysh">已审核</div>
          <div v-else
               class="yth">已退回</div>
        </div>
      </div>
      
        <el-table :data="tableData"
                :default-expand-all="true"
                :empty-text="emptyText"
                v-loading="loading"
                ref="tableMain"
                @row-click="showHide"
                style="width: 100%;font-size:12px">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.orderDtos"
                      border
                      :cell-style="tableRowClassName"
                      style="width: 100%;font-size:12px;cursor:hand">
                <el-table-column prop="throughArea"
                                label="特战区域名称">
                </el-table-column>
                <el-table-column prop="intime"
                                width="100px"
                                label="进入时间">
                </el-table-column>
                <el-table-column prop="outtime"
                                width="100px"
                                label="离开时间">
                </el-table-column>
                <el-table-column prop="days"
                                label="停留天数">
                </el-table-column>
                <el-table-column label="空满载">
                  <template slot-scope="scope">
                    <el-radio v-model="scope.row.loadInfo"
                              v-if="nameType === 'SHIPOWNER' && props.row.state === '2'"
                              label="满载">满载</el-radio>
                    <el-radio v-model="scope.row.loadInfo"
                              v-if="nameType === 'SHIPOWNER' && props.row.state === '2'"
                              label="空载">空载</el-radio>
                    <span v-else>{{scope.row.loadInfo}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="120px" prop="anchoragePort"
                                label="挂靠特战区港口">
                </el-table-column>
                <el-table-column prop="anchorageDate"
                                label="挂靠时间">
                </el-table-column>
                <el-table-column label="安保人数">
                  <template slot-scope="scope">

                    <el-select v-model="scope.row.guardsNo"
                              v-if="nameType === 'SHIPOWNER' &&  props.row.state ==='2' "
                              placeholder="请选择">
                      <el-option v-for="todos in guardList"
                                :key="todos.length"
                                :label="todos.value"
                                :value="todos.value"></el-option>
                    </el-select>
                    <span v-else>{{scope.row.guardsNo}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="K&R">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.karAmount"
                              v-if="nameType === 'SHIPOWNER' && props.row.state === '2'"
                              placeholder="请选择">
                      <el-option v-for="todos in KidnapList"
                                :key="todos.length"
                                :label="todos.value"
                                :value="todos.value"></el-option>
                    </el-select>
                    <span v-else>{{scope.row.karAmount}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="船名"
                          width="90px"
                          prop="shipCName">
          </el-table-column>
          <el-table-column label="特战区"
                          width="85px"
                          prop="throughAreaSum">
                          <!-- 表格内换行 -->
                          <template scope="scope">{{scope.row.throughAreaSum}}</template>
          </el-table-column>
          <el-table-column label="天数"
                          width="50px"
                          prop="daysPlus">
            <template scope="scope">
              <el-button type="text"
              style="color:#606266" 
              @click="toogleExpand(scope.row)"
              >
                {{scope.row.daysPlus}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="航次"
                          width="70px"
                          prop="line">
            <template scope="scope">
              <el-button type="text"
              style="color:#606266" 
              @click="toogleExpand(scope.row)"
              >
                {{scope.row.line}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column width="70px" label="出发港"
                          prop="departurePort">
          </el-table-column>
          <el-table-column label="出发时间"
                          width="100px"
                          prop="etd">
          </el-table-column>
          <el-table-column width="80px" label="目的港"
                          prop="arrivalPort">
          </el-table-column>
          <el-table-column label="到达时间"
                          width="100px"
                          prop="eta">
          </el-table-column>
          <el-table-column width="130px" label="挂靠港"
                          prop="ports">
          </el-table-column>
          <el-table-column prop="insuranceAmountCurrency"
                          width="100px"
                          label="保险金额">
          </el-table-column>
          <el-table-column prop="sumPremium"
                          label="最终保费">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sumPremium" oninput="value=value.replace(/^[^0-9]/,'')"
                        v-if="nameType === 'BROKER' && item.status !== '1'"></el-input>
              <span v-else>{{scope.row.sumPremium}}</span>
            </template>
          </el-table-column>
            <el-table-column
                    width="80px" prop="needDeclare"
                    label="无需申报">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.needDeclare"
                               :disabled="nameType === 'BROKER' || scope.row.state !=='2'?true:false"
                               active-value="0"
                               inactive-value="1"
                               active-color="#13ce66"
                               inactive-color="#888">
                    </el-switch>
                </template>
            </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-button type="info"
                        v-if="nameType === 'BROKER' &&  scope.row.state ==='0' "
                        :disabled="item.status==='2'? true:false"
                        @click="isRuts(scope.row)">不通过</el-button>
<!--              <el-button type="warning"-->
<!--                        :disabled="item.status==='2'? true:false"-->
<!--                        v-if="nameType === 'BROKER' &&  scope.row.state ==='1' "-->
<!--                        @click="isRuts(scope.row)">需申报</el-button>-->
              <el-button type="danger"
                        :disabled="item.status==='2'? true:false"
                        v-if="nameType === 'BROKER' &&  scope.row.state ==='2' "
                        @click="isLings(scope.row)">不通过</el-button>
              <el-button type="info"
                        v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='0' ">待审核</el-button>
<!--              <el-button type="warning"-->
<!--                        v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='1' ">无需申报</el-button>-->
              <el-button type="danger"
                        v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='2' ">被退回</el-button>

              <el-button type="info"
                        v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='0' ">待审核</el-button>
<!--              <el-button type="warning"-->
<!--                        v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='1' ">无需申报</el-button>-->
              <el-button type="danger"
                        v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='2' ">被退回</el-button>
              <el-button type="success"
                        v-if="scope.row.state ==='3' ">已审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      
      <div class='thyj'>
        <h4 class="fs">退回意见：</h4>
        <ul id="is">
          <li v-for="todos in getList"
              :key="todos.length">{{todos.content}}</li>
        </ul>
      </div>
      <el-input type="textarea"
                v-if="nameType === 'BROKER'"
                :rows="5"
                class="inls"
                placeholder="请输入退回意见"
                v-model="textarea2">
      </el-input>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: true,
      emptyText: '加载中',
      tableData: [],
      primarys: 'primary',
      disabled: false,
      item: null,
      nameType: '',
      currentRow: '',
      bgc: {
        backgroundImage: 'url(' + require('../../assets/tzxbgc.png') + ')'
      },
      textarea2: '',
      getList: null,
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
        }],
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
      }]
    }
  },
  methods: {
    showHide(row,index,e){
      this.$refs.tableMain.toggleRowExpansion(row)
    }
    ,
    toogleExpand(row) {
      let $table = this.$refs.tableMain;
      this.tableData.map((item) => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    }
    ,
    // 经济公司
    async isGetList (value) {
      this.loading = true
      let res = await this.$http.get('/broker/orders', {
        params: {
          batchNum: value
        }
      })
      if (res.status === 200) {
        //千分位
        for(let d of res.data.list){
          let plus = 0;
            let arr = [];
            for(let i of d['orderDtos']){
              // sum += i.throughArea + '\n';
              // d['throughAreaSum'] = sum;
              if(!arr.includes(i.throughArea)){
                  arr.push(i.throughArea);
              }
              plus += Number(i.days);
              d['daysPlus'] = plus.toFixed(2);
            }
            d.throughAreaSum = arr.join('\n')

          if(d['insuranceAmount']){
            d['insuranceAmountCurrency'] = d['currency'] + '\n' + (d['insuranceAmount'].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'))
          }else{
            d['insuranceAmountCurrency'] = ''
          }
        }
        this.tableData = res.data.list
        this.tableData.forEach(item => {
          if (item.state === '2') {
            this.disabled = true
            this.primarys = 'info'
          }
        })
      }

      if (!(this.tableData && this.tableData.length > 0)) {
        this.emptyText = '暂无数据'
      }else{
        this.emptyText = ''
      }
      this.loading = false
    },
    // 货运公司
    async isGetLists (value) {
      this.loading = true
      let res = await this.$http.get('/shiper/orders', {
        params: {
          batchNum: value
        }
      })
      if (res.status === 200) {
        //千分位
        for(let d of res.data.list){
          let plus = 0;
            let arr = [];
            for(let i of d['orderDtos']){
              // sum += i.throughArea + '\n';
              // d['throughAreaSum'] = sum;
              if(!arr.includes(i.throughArea)){
                  arr.push(i.throughArea);
              }
              plus += Number(i.days);
              d['daysPlus'] = plus.toFixed(2);
            }
            d.throughAreaSum = arr.join('\n');

          if(d['insuranceAmount']){
            d['insuranceAmountCurrency'] = d['currency'] + '\n' + (d['insuranceAmount'].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'))
          }else{
            d['insuranceAmountCurrency'] = ''
          }
        }
        this.tableData = res.data.list
      }

      if (!(this.tableData && this.tableData.length > 0)) {
        this.emptyText = '暂无数据'
      }else{
        this.emptyText = ''
      }
      this.loading = false
    },
    async isGetListsd (value) {
      this.loading = true
      let res = await this.$http.get('/captive/orders', {
        params: {
          batchNum: value
        }
      })
      if (res.status === 200) {
        //千分位
        for(let d of res.data.list){
          let plus = 0;
            let arr = [];
            for(let i of d['orderDtos']){
              // sum += i.throughArea + '\n';
              // d['throughAreaSum'] = sum;
              if(!arr.includes(i.throughArea)){
                  arr.push(i.throughArea);
              }
              plus += Number(i.days);
              d['daysPlus'] = plus.toFixed(2);
            }
            d.throughAreaSum = arr.join('\n')

          if(d['insuranceAmount']){
            d['insuranceAmountCurrency'] = d['currency'] + '\n' + (d['insuranceAmount'].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'))
          }else{
            d['insuranceAmountCurrency'] = ''
          }
        }
        this.tableData = res.data.list
        if (!(this.tableData && this.tableData.length > 0)) {
          this.emptyText = '暂无数据'
        }else{
          this.emptyText = ''
        }
        this.loading = false
      }
    },
    isLoad (filename) {
      this.$http({
        method: 'get',
        url: `/files/load?filename=${filename}`,
        responseType: 'blob'
      }).then(response => {
        console.log(response.headers["content-disposition"])
        var fileName = response.headers["content-disposition"].split(";")[1].split("filename=")[1];
        this.download(response.data, decodeURI(fileName))
      })
    },
    download (data, file) {
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
    isExport (filename, batchNum) {
      this.$http({
        method: 'get',
        url: `/files/exportExcel?filename=${filename}&batchNum=${batchNum}`,
        responseType: 'blob'
      }).then(response => {
        const file = response.headers['content-disposition']
        filename = file.includes('filename=') ? file.split('=')[1] : filename
        this.download(response.data, filename)
      }).catch(error => {
        console.log(error)
      })
    },
    tableRowClassName (row) {
      if (row.row.throughArea === '印度洋') {
        return 'background: oldlace'
      } else if (row.row.throughArea === '亚丁湾') {
        return 'background: oldlace'
      } else {
        return ''
      }
    },
    async isReturns () {
      let obj = {
        batchNum: this.item.batchNum,
        status: '2',
        premium: this.item.premium,
        fileName: this.item.fileName,
        fileId: this.item.fileId,
        createby: this.item.createby,
        createtime: this.item.createtime,
        uuid: this.item.uuid
      }
      let promst = {
        batch: obj,
        list: this.tableData,
        content: this.textarea2
      }

      let res = await this.$http.post('/broker/saveInsuranceOrders', promst)
      if (res.status === 200) {
        this.$message({
          message: '退回成功',
          type: 'success'
        })
        this.$router.push({ name: 'batch' })
      }
    },
    checkAdult(item) {
      if (item.sumPremium !== null && item.sumPremium !== '' && item.sumPremium >= 0) {
        return true
      } else {
        return false
      }
    },
    async isPass () {
      if (this.tableData.every(this.checkAdult)) {
        let obj = {
          batchNum: this.item.batchNum,
          status: '1',
          premium: this.item.premium,
          fileName: this.item.fileName,
          fileId: this.item.fileId,
          createby: this.item.createby,
          createtime: this.item.createtime,
          uuid: this.item.uuid
        }
        this.tableData.forEach(item => {
          if (item.state !== '1') {
            item.state = '3'
          }
        })
        let promst = {
          batch: obj,
          list: this.tableData
        }
        let res = await this.$http.post('/broker/saveInsuranceOrders', promst)

        if (res.status === 200 ) {
            this.$message({
            message: '审核通过',
            type: 'success'
            })
            this.$router.push({ name: 'batch' })
        }
      } else {
        this.$message.error('请完成各航次最终保费')
      }
    }
    ,
    isRuts (value) {
      value.state = '2'
      if (this.tableData.some(item => { if (item.state === '2') { return true } })) {
        this.disabled = true
        this.primarys = 'info'
      } else {
        this.disabled = false
        this.primarys = 'primary'
      }
    },
    isLings (value) {
      value.state = '0'
      if (this.tableData.some(item => { if (item.state === '2') { return true } })) {
        this.disabled = true
        this.primarys = 'info'
      } else {
        this.disabled = false
        this.primarys = 'primary'
      }
    },
    isFu () {
      this.$router.go(-1)
    },
    async isPinLun (uuid) {
      let res = await this.$http.get('/common/remark', { params: { uuid } })
      if (res.status === 200) {
        this.getList = res.data
      }
    },
    async isSubmission () {
      let obj = {
        batchNum: this.item.batchNum,
        status: '0',
        premium: this.item.premium,
        fileName: this.item.fileName,
        fileId: this.item.fileId,
        uuid: this.item.uuid
      }
      this.tableData.forEach(item => {
        item.state = '0'
      })
      let promst = {
        batch: obj,
        list: this.tableData
      }
      let res = await this.$http.post('/shiper/saveInsuranceOrders', promst)
      if (res.status === 200) {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.$router.go(-1)
      }
    },
    beforeUpload (file) {
      let fd = new FormData()
      fd.append('file', file)// 传文件
      fd.append('fileName', file.name)
      this.$http.post('/files/save', fd).then(res => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.item.fileId = res.data
          this.item.fileName = file.name
          this.fits = '附件:' + file.name
        }
      })
    }
  },
  created () {
    this.nameType = localStorage.getItem('nametype')
    this.item = JSON.parse(localStorage.getItem('leef'))
    this.isPinLun(this.item.uuid)
    if (this.nameType === 'BROKER') {
      this.isGetList(this.item.uuid)
    } else if (this.nameType === 'SHIPOWNER') {
      this.isGetLists(this.item.uuid)
    } else {
      this.isGetListsd(this.item.uuid)
    }
  }
}

</script>
<style scoped>
.info {
  width: 100%;
}
.logo_bgc {
  width: 100%;
  height: 200px;
  background-size: 100% 100%;
}
.logo_botton {
  width: 1200px;
  margin: 0 auto;
  /* padding: 0 0 40px 0; */
  background-color: #fff;
}

.btnxz {
  width: 100%;
  height: 80px;
  margin-bottom: 20px;
  line-height: 80px;
  padding-left: 40px;
  box-sizing: border-box;
  position: relative;
}
.fr {
  float: right;
  margin-top: 20px;
}
.mr {
  margin-right: 40px;
}
.thyj {
  width: 100%;
  height: 80px;
  line-height: 80px;
  background: #b4b4b4;
  /* margin-top: 30px; */
}
#is {
  padding: 0;
  margin: 0;
}
#is li {
  width: 90%;
  border: 1px solid #000;
  padding: 10px;
  list-style: none;
  margin: 10px 0 10px 80px;
  border-radius: 5px;
}
.fs {
  margin:0 0 0 50px;
}
.inls {
  margin-top: 20px;
}
.title_s {
  width: 100%;
  height: 60px;
}
.fdsa {
  float: left;
  font-size: 18px;
}
.ml10 {
  margin-left: 30px;
}
.dsh {
  padding: 6px;
  width: 58px;
  border: 1px solid #909399;
  background-color: #909399;
  border-radius: 5px;
  color: #fff;
  float: right;
  margin-top: -5px;
}
.ysh {
  padding: 6px;
  width: 58px;
  border: 1px solid #67c23a;
  background-color: #67c23a;
  border-radius: 5px;
  color: #fff;
  float: right;
  margin-top: -5px;
}
.yth {
  padding: 6px;
  width: 58px;
  border: 1px solid #f56c6c;
  background-color: #f56c6c;
  color: #fff;
  border-radius: 5px;
  float: right;
  margin-top: -5px;
}

.inputs {
  width: 200px;
  position: absolute;
  right: 40px;
}
.inputs_span {
  position: absolute;
  right: 164px;
  top: 8px;
}
.s_span {
  position: absolute;
  right: 238px;
  top: 8px;
}
.el-upload__tip {
  float: right;
  margin-top: 0;
  margin-left: 8px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.left_button {
  display: inline-block;
  margin: 10px;
}
.right_button {
  display: inline-block;
  margin: 25px;
}
a{
  text-decoration:none;
}
</style>
<style type="text/css">
.el-table .cell{
  white-space: pre-line;
}
</style>


