<template>
  <!-- s申报批次点击查询后的弹出框 -->
  <div class="info">
    <!-- 背景图片 -->
    <div class="bgc" :style="bgc"></div>
    <!-- 具体内容 -->
    <div class="info_title">

      <div class="info_ss" style="height: 40px;line-height: 40px;">
        <span class="cm" style="font-size: 16px;">申报批次：</span>
      </div>

      <div class="info_ss">
        <span class="cm">批次</span>
        <el-input placeholder="请输入申报批次" size="small" v-model="input" class="inpt_width">
        </el-input>
        <span class="cm m10" v-if="nameType !== 'SHIPOWNER'">申报公司</span>
        <el-select v-model="value" v-if="nameType !== 'SHIPOWNER'" clearable size="small" class="inpt_width"
          placeholder="请选择">
          <el-option v-for="item in tableList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="cm m10">状态</span>
        <el-select v-model="statu" clearable size="small" class="inpt_width" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="isGets()" plain>查询</el-button>
      </div>

      <div class="info_ss" style="height: 40px;line-height: 40px;">
        <span class="cm" style="font-size: 16px;">申报详情：</span>
      </div>
      <div class="info_ss">
        <span class="cm">船名</span>
        <el-input placeholder="请输入船名" size="small" v-model="searchShipName" class="inpt_width">
        </el-input>
        <span class="cm m10">状态</span>
        <el-select v-model="state" clearable size="small" class="inpt_width" placeholder="请选择">
          <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="cm m10">航次起始日期</span>
        <el-date-picker v-model="startEndDate" type="daterange" size="small" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" size="mini" @click="detailsSearch()" plain>查询</el-button>
      </div>

      <el-table id="detailTeble" :data="tableData" @cell-click='moreClick' :empty-text="emptyText" v-loading="loading"
        style="width: 100%;cursor:pointer;">
        <el-table-column prop="batchNum" label="申报批次">
        </el-table-column>
        <el-table-column prop="createby" label="申报公司">
        </el-table-column>
        <el-table-column prop="createName" label="提交人">
        </el-table-column>
        <el-table-column prop="createtime" label="提交时间">
        </el-table-column>
        <el-table-column prop="checkBy" label="审核人">
        </el-table-column>
        <el-table-column prop="checkTime" label="审核时间">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status === '0'" class="ysh">待审核</div>
            <div v-else-if="scope.row.status === '1'" class="dsh">已审核</div>
            <div v-else-if="scope.row.status === '2'" class="yth">已退回</div>
            <div v-else-if="scope.row.status === '3'" class="yth diff">有疑议</div>
            <div v-else class="ysh">待确认</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background class="fl" layout="prev, pager, next" :total="total" :current-page="page"
        :page-size="pagesize" @current-change="changePage">
      </el-pagination>
    </div>


    <el-dialog :visible.sync="dialogVisible" width="80%">
      <template slot="title">
        <div class="dialog-layer">
          <div class="dialog-layer-title">船舶搜索结果</div>
          <el-button type="primary" size="mini" @click="detailsSearchExport()" class="dialog-layer-export">导出
          </el-button>
        </div>
      </template>
      <template slot="footer">
        <el-table :data="dialogData" :default-expand-all="true" style="width: 100%;margin-top:-50px;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.orderDtos" :cell-style="tableRowClassName" border style="width: 100%">
                <el-table-column prop="throughArea" label="特战区域名称">
                </el-table-column>
                <el-table-column prop="intime" width="100px" label="进入时间">
                </el-table-column>
                <el-table-column prop="outtime" width="100px" label="离开时间">
                </el-table-column>
                <el-table-column prop="days" label="停留天数">
                </el-table-column>
                <el-table-column label="空满载">
                  <template slot-scope="scope">
                    <el-radio v-model="scope.row.loadInfo" v-if="nameType === 'SHIPOWNER' && props.row.state === '2'"
                      label="满载">满载</el-radio>
                    <el-radio v-model="scope.row.loadInfo" v-if="nameType === 'SHIPOWNER' && props.row.state === '2'"
                      label="空载">空载</el-radio>
                    <span v-else>{{scope.row.loadInfo}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="anchoragePort" label="挂靠港名">
                </el-table-column>
                <el-table-column prop="anchorageDate" label="挂靠特战区港口时间">
                </el-table-column>
                <el-table-column label="安保人数">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.guardsNo" v-if="nameType === 'SHIPOWNER' &&  props.row.state ==='2' "
                      placeholder="请选择">
                      <el-option v-for="todos in guardList" :key="todos.length" :label="todos.value"
                        :value="todos.value"></el-option>
                    </el-select>
                    <span v-else>{{scope.row.guardsNo}}</span>
                  </template>
                </el-table-column>

                <el-table-column label="K&R">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.karAmount" v-if="nameType === 'SHIPOWNER' && props.row.state === '2'"
                      placeholder="请选择">
                      <el-option v-for="todos in KidnapList" :key="todos.length" :label="todos.value"
                        :value="todos.value"></el-option>

                    </el-select>
                    <span v-else>{{scope.row.karAmount}}</span>
                  </template>
                </el-table-column>

              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="船名" prop="shipCName">
          </el-table-column>
          <el-table-column width="70px" label="航次" prop="line">
            <template scope="scope">
              <span class="line-class" @click="clickLine(scope.row)">{{scope.row.line}}</span>
            </template>
          </el-table-column>
          <el-table-column label="出发港/时间" prop="departurePort">
            <template slot-scope="scope">
              <span>{{ scope.row.departurePort }}</span><br>
              <span>{{scope.row.etd}}</span>
            </template>
          </el-table-column>
         
          <el-table-column label="目的港" prop="arrivalPort">
            <template slot-scope="scope">
              <span>{{ scope.row.arrivalPort }}</span><br>
              <span>{{scope.row.eta}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="到达时间" width="100px" prop="eta">
          </el-table-column> -->
          <el-table-column label="挂靠港" prop="ports">
          </el-table-column>
          <el-table-column prop="insuranceAmount" label="保险金额">
          </el-table-column>

          <el-table-column prop="sumPremium" label="最终保费">
            <template slot-scope="scope">
              <span>{{scope.row.sumPremium}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">

              <el-button type="info" v-if="nameType === 'BROKER' &&  scope.row.state ==='0' "
                :disabled="item.status==='2'? true:false" @click="isRuts(scope.row)">不通过</el-button>
              <el-button type="warning" :disabled="item.status==='2'? true:false"
                v-if="nameType === 'BROKER' &&  scope.row.state ==='1' " @click="isRuts(scope.row)">需申报</el-button>
              <el-button type="danger" :disabled="item.status==='2'? true:false"
                v-if="nameType === 'BROKER' &&  scope.row.state ==='2' " @click="isLings(scope.row)">不通过</el-button>
              <el-button type="info" v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='0' ">待审核</el-button>
              <el-button type="warning" v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='1' ">无需申报</el-button>
              <el-button type="danger" v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='2' ">被退回</el-button>

              <el-button type="info" v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='0' ">待审核</el-button>
              <el-button type="warning" v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='1' ">无需申报</el-button>
              <el-button type="danger" v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='2' ">被退回</el-button>
              <el-button type="success" v-if="scope.row.state ==='3' ">已审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import * as batchApi from '@/api/batch'
  export default {
    data() {
      return {
        value: '',
        input: '',
        statu: '',
        searchShipName: '',
        dialogData: [],
        dialogVisible: false,
        bgc: {
          backgroundImage: 'url(' + require('../../assets/tzxbgc.png') + ')'
        },
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '待审核'
        }, {
          value: '1',
          label: '已审核'
        }, {
          value: '2',
          label: '已退回'
        }, {
          value: '3',
          label: '有疑议'
        }, {
          value: '4',
          label: '待确认'
        }],
        state: '',
        states: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '待审核'
        }, {
          value: '3',
          label: '已审核'
        }, {
          value: '2',
          label: '已退回'
        }],

        startEndDate: [],
        loading: true,
        emptyText: '加载中',
        tableData: [],
        nameType: '',
        tableList: [],
        total: 0,
        page: 1,
        pagesize: 10
      }
    },
    methods: {


      clickLine(row) {
        this.storage.clickLine(row);
      },
      dateFormat(date) {
        if (date) {
          return new Date(date).toLocaleDateString().replace(/\//g, '-');
        }
        return null;
      },
      detailsSearch() {
        let [startDate, endDate] = (this.startEndDate && (this.startEndDate.length > 0)) ? this.startEndDate: [];
        let par = {
          state: this.state,
          shipEName: this.searchShipName,
          dateStatus: '0', //固定按照航次开始日期查询
          endDate: (endDate ? this.dateFormat(endDate) + ' 23:59:59' : ''),
          startDate: (startDate ? this.dateFormat(startDate) + ' 00:00:00' : '')
        };
        batchApi.detailsSearch(par).then(res => {
          this.dialogData = res.data.list
          console.log( this.dialogData )
          this.dialogVisible = true
        })
      },

      detailsSearchExport() {
        let [startDate, endDate] = (this.startEndDate && (this.startEndDate.length > 0)) ? this.startEndDate: [];
        let startTime = startDate ? this.dateFormat(startDate) + ' 00:00:00' : '';
        let endTime = endDate ? this.dateFormat(endDate) + ' 23:59:59' : '';
        let reqUrl = `/files/exportDeclared?state=${this.state}&shipEName=${this.searchShipName}'+
          '&dateStatus=0&startDate=${startTime}&endDate=${endTime}`;
        this.$http({
          method: 'get',
          url: reqUrl,
          responseType: 'blob'
        }).then(response => {
          const file = response.headers['content-disposition']
          let filename = file.split('=')[1];
          let pos = filename.lastIndexOf('.');
          filename = 'Bath' + new Date().getTime() + filename.substr(pos);
          this.download(response.data, filename)
        }).catch(error => {
          this.$message.error('导出错误！');
        })
      },
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
      
      async isGetList(batchNum = '', createBy = '', status = '', page = 1) {
        this.loading = true;
        console.log(this.page)
        batchNum = (batchNum === '') ? batchNum : ('%' + batchNum + '%');
        let res = await this.$http.get('/broker/batchList', {
          params: {
            batchNum,
            createBy,
            status,
            num: 10,
            page:this.page
          }
        })

        if (res.status === 200) {
          this.tableData = res.data.list
          console.log(this.tableData)
          this.total = res.data.total
          this.page = res.data.page
        }
        if (!(this.tableData && this.tableData.length > 0)) {
          this.emptyText = '暂无数据'
        } else {
          this.emptyText = ''
        }
        this.loading = false
      },


      // tableData的数据
      async isGetLists(batchNum = '', createBy = '', status = '', page = 1) {
        // page
        
        this.loading = true
        batchNum = (batchNum === '') ? batchNum : ('%' + batchNum + '%');
        let res = await this.$http.get('/shiper/batchList', {
          params: {
            batchNum,
            createBy,
            status,
            num: 10,
            page:this.page
          }
        })

        if (res.status === 200) {
          console.log(res)
          this.tableData = res.data.list
          console.log(this.tableData)
          this.total = res.data.total
          this.page = res.data.page
        }
        if (!(this.tableData && this.tableData.length > 0)) {
          this.emptyText = '暂无数据'
        } else {
          this.emptyText = ''
        }
        this.loading = false
      },
      async isGetListsd(batchNum = '', createBy = '', status = '', page = 1) {
        this.loading = true;
        batchNum = (batchNum === '') ? batchNum : ('%' + batchNum + '%');
        let res = await this.$http.get('/captive/batchList', {
          params: {
            batchNum,
            createBy,
            status,
            num: 10,
            page
          }
        })

        if (res.status === 200) {
          this.tableData = res.data.list
          console.log(this.tableData)
          this.total = res.data.total
          this.page = res.data.page
        }
        if (!(this.tableData && this.tableData.length > 0)) {
          this.emptyText = '暂无数据'
        } else {
          this.emptyText = ''
        }
        this.loading = false
      },
      moreClick(row) {
        localStorage.setItem('leef', JSON.stringify(row))
        this.$router.push({
          name: 'modify'
        })
      },
      async isGets() {
        if (this.nameType === 'BROKER') {
          this.isGetList(this.input, this.value, this.statu, 1)
        } else if (this.nameType === 'SHIPOWNER') {
          this.isGetLists(this.input, this.value, this.statu, 1)
        } else {
          this.isGetListsd(this.input, this.value, this.statu, 1)
        }
      },
      async isGetName() {
        let res = await this.$http.get('/broker/create')
        res.data.forEach(item => {
          let obj = {}
          obj.value = item
          obj.label = item
          this.tableList.push(obj)
        })
      },
      async isGetNameList() {
        let res = await this.$http.get('/captive/create')
        res.data.forEach(item => {
          let obj = {}
          obj.value = item
          obj.label = item
          this.tableList.push(obj)
        })
      },
      changePage(Page) {
        console.log('a')
        this.page = Page;
        if(this.nameType === 'BROKER'){
          this.isGetList();
        }else{
          this.isGetLists();
        }
        
        // this.$router.push(`/batch/${Page}`)
      }
    },
    created() {
      this.nameType = localStorage.getItem('nametype')
      if (this.nameType === 'BROKER') {
        this.isGetList()
        this.isGetName()
      } else if (this.nameType === 'SHIPOWNER') {
        var param = this.$route.params;
        this.statu = param ? (param.status ? param.status : '') : '';
        this.isGetLists('', '', this.statu, 1);
      } else {
        this.isGetListsd()
        this.isGetNameList()
      }
    },
    watch: {
      $route(to, from) {
        const page = to.params.page - 0
        if (this.nameType === 'SHIPOWNER') {
          this.isGetLists(this.input, this.value, this.statu, page)
        } else if (this.nameType === 'BROKER') {
          this.isGetList(this.input, this.value, this.statu, page)
        } else {
          this.isGetListsd(this.input, this.value, this.statu, page)
        }
      }
    }

  }
</script>
<style scoped>
  .diff{
    background: #e6a23c !important;
    border: 1px solid #e6a23c !important;
  }

  .info {
    width: 100%;
    background-color: #f5f5f6;
  }

  .bgc {
    width: 100%;
    height: 200px;
    background-size: 100% 100%;
  }

  .info_title {
    width: 1200px;
    margin: 0 auto 40px;
    background-color: #fff;
  }

  .info_ss {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 0 23px;
  }

  .list_ss {
    height: 50px;
    background: rgba(255, 255, 255, 1);
    line-height: 50px;
    box-sizing: border-box;
    padding: 0 23px;
  }

  .cm {
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
  }

  .inpt_width {
    width: 190px;
    margin-left: 8px;
  }

  .m10 {
    margin-left: 15px;
  }

  .dsh {
    padding: 6px;
    width: 58px;
    border: 1px solid #909399;
    background-color: #909399;
    border-radius: 5px;
    color: #fff;
  }

  .ysh {
    padding: 6px;
    width: 58px;
    border: 1px solid #67c23a;
    background-color: #67c23a;
    border-radius: 5px;
    color: #fff;
  }

  .yth {
    padding: 6px;
    width: 58px;
    border: 1px solid #f56c6c;
    background-color: #f56c6c;
    border-radius: 5px;
    color: #fff;
  }

  .fl {
    float: right;
  }

  .float_left {
    float: right;
  }

  .dialog-layer {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  .dialog-layer-title {
    margin-left: 20px;
    font-size: 18px;
  }

  .dialog-layer-export {
    margin-left: auto;
    margin-right: 100px;
  }
</style>