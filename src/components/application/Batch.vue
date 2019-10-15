<template>
  <div class="info">
    <!-- 背景图片 -->
    <div class="bgc"
         :style="bgc"></div>
    <!-- 具体内容 -->
    <div class="info_title">
      <div class="info_ss">
        <span class="cm">申报批次</span>
        <el-input placeholder="请输入申报批次"
                  size="small"
                  v-model="input"
                  class="inpt_width">
        </el-input>
        <span class="cm m10"
              v-if="nameType !== 'SHIPOWNER'">申报公司</span>
        <el-select v-model="value"
                   v-if="nameType !== 'SHIPOWNER'"
                   clearable
                   size="small"
                   class="inpt_width"
                   placeholder="请选择">
          <el-option v-for="item in tableList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <span class="cm m10">状态</span>
        <el-select v-model="statu"
                   clearable
                   size="small"
                   class="inpt_width"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary"
                   size="mini"
                   @click="isGets()"
                   plain>查询</el-button>

        <div class="float_left">
          <span class="cm">船名</span>
          <el-input placeholder="请输入船名"
                    size="small"
                    v-model="searchShipName"
                    @keyup.enter.native="searchByShipName"
                    class="inpt_width">
          </el-input>
          <el-button type="primary"
                    size="mini"
                    @click="searchByShipName"
                    plain>查询</el-button>
        </div>
      </div>
      <el-table :data="tableData"
                @cell-click='moreClick'
                :empty-text="emptyText"
                v-loading="loading"
                style="width: 100%;cursor:pointer;">
        <el-table-column prop="batchNum"
                         label="申报批次">
        </el-table-column>
        <el-table-column prop="createby"
                         label="申报人">
        </el-table-column>
        <el-table-column prop="createtime"
                         label="提交时间">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status === '0'"
                 class="ysh">待审核</div>
            <div v-else-if="scope.row.status === '1'"
                 class="dsh">已审核</div>
            <div v-else
                 class="yth">已退回</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     class="fl"
                     layout="prev, pager, next"
                     :total="total"
                     :current-page="page"
                     :page-size="pagesize"
                     @current-change="changePage">
      </el-pagination>
    </div>
    <el-dialog
      title="船舶搜索结果"
      :visible.sync="dialogVisible"
      width="80%">
      <el-table :data="dialogData"
              :default-expand-all="true"
              style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.orderDtos"
                    :cell-style="tableRowClassName"
                    border
                    style="width: 100%">
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
              <el-table-column prop="anchoragePort"
                               label="挂靠港名">
              </el-table-column>
              <el-table-column prop="anchorageDate"
                               label="挂靠特战区港口时间">
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
                         prop="shipCName">
        </el-table-column>
        <el-table-column label="航次"
                         prop="line">
        </el-table-column>
        <el-table-column label="出发港"
                         prop="departurePort">
        </el-table-column>
        <el-table-column label="出发时间"
                         width="100px"
                         prop="etd">
        </el-table-column>
        <el-table-column label="目的港"
                         prop="arrivalPort">
        </el-table-column>
        <el-table-column label="到达时间"
                         width="100px"
                         prop="eta">
        </el-table-column>
        <el-table-column label="挂靠港"
                         prop="ports">
        </el-table-column>
        <el-table-column prop="insuranceAmount"
                         label="保险金额">
        </el-table-column>

        <el-table-column prop="sumPremium"
                         label="最终保费">
          <template slot-scope="scope">
            <span>{{scope.row.sumPremium}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">

            <el-button type="info"
                       v-if="nameType === 'BROKER' &&  scope.row.state ==='0' "
                       :disabled="item.status==='2'? true:false"
                       @click="isRuts(scope.row)">不通过</el-button>
            <el-button type="warning"
                       :disabled="item.status==='2'? true:false"
                       v-if="nameType === 'BROKER' &&  scope.row.state ==='1' "
                       @click="isRuts(scope.row)">需申报</el-button>
            <el-button type="danger"
                       :disabled="item.status==='2'? true:false"
                       v-if="nameType === 'BROKER' &&  scope.row.state ==='2' "
                       @click="isLings(scope.row)">不通过</el-button>
            <el-button type="info"
                       v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='0' ">待审核</el-button>
            <el-button type="warning"
                       v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='1' ">无需申报</el-button>
            <el-button type="danger"
                       v-if="nameType === 'SHIPOWNER' &&  scope.row.state ==='2' ">被退回</el-button>

            <el-button type="info"
                       v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='0' ">待审核</el-button>
            <el-button type="warning"
                       v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='1' ">无需申报</el-button>
            <el-button type="danger"
                       v-if="nameType === 'CAPTIVE' &&  scope.row.state ==='2' ">被退回</el-button>
            <el-button type="success"
                       v-if="scope.row.state ==='3' ">已审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import * as batchApi from '@/api/batch'

export default {
  data () {
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
      },{
        value: '0',
        label: '待审核'
      }, {
        value: '1',
        label: '已审核'
      }, {
        value: '2',
        label: '已退回'
      }],
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
    searchByShipName() {
      batchApi.searchByShipName({ shipEName: this.searchShipName}).then(res => {
        this.dialogData = res.data.list
        this.dialogVisible = true
      }) 
    },
    async isGetList (batchNum = '', createBy = '', status = '', page = 1) {
      let res = await this.$http.get('/broker/batchList', {
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
        this.total = res.data.total
        this.page = res.data.page
      }
    },
    async isGetLists (batchNum = '', createBy = '', status = '', page = 1) {
      this.loading = true
      let res = await this.$http.get('/shiper/batchList', {
        params: {
          batchNum,
          createBy,
          status,
          num: 10,
          page
        } }
      )
      if (res.status === 200) {
        this.tableData = res.data.list
        this.total = res.data.total
        this.page = res.data.page
      }
      if (!(this.tableData && this.tableData.length > 0)) {
        this.emptyText = '暂无数据'
      }else{
        this.emptyText = ''
      }
      this.loading = false
    },
    async isGetListsd (batchNum = '', createBy = '', status = '', page = 1) {
      let res = await this.$http.get('/captive/batchList', {
        params: {
          batchNum,
          createBy,
          status,
          num: 10,
          page
        } })

      if (res.status === 200) {
        this.tableData = res.data.list
        this.total = res.data.total
        this.page = res.data.page
      }
    },
    moreClick (row) {
      localStorage.setItem('leef', JSON.stringify(row))
      this.$router.push({ name: 'modify' })
    },
    async isGets () {
      if (this.nameType === 'BROKER') {
        this.isGetList(this.input, this.value, this.statu, 1)
      } else if (this.nameType === 'SHIPOWNER') {
        this.isGetLists(this.input, this.value, this.statu, 1)
      } else {
        this.isGetListsd(this.input, this.value, this.statu, 1)
      }
    },
    async isGetName () {
      let res = await this.$http.get('/broker/create')
      res.data.forEach(item => {
        let obj = {}
        obj.value = item
        obj.label = item
        this.tableList.push(obj)
      })
    },
    async isGetNameList () {
      let res = await this.$http.get('/captive/create')
      res.data.forEach(item => {
        let obj = {}
        obj.value = item
        obj.label = item
        this.tableList.push(obj)
      })
    },
    changePage (Page) {
      this.$router.push(`/batch/${Page}`)
    }
  },
  created () {
    this.nameType = localStorage.getItem('nametype')
    if (this.nameType === 'BROKER') {
      this.isGetList()
      this.isGetName()
    } else if (this.nameType === 'SHIPOWNER') {
      this.isGetLists()
    } else {
      this.isGetListsd()
      this.isGetNameList()
    }
  },
  watch: {
    $route (to, from) {
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
  margin-top: 22px;
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
</style>
