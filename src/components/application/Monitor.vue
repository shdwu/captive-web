<template>
  <div class="info">
    <!-- 背景图片 -->
    <div class="bgc"
         :style="bgc"></div>
    <!-- 具体内容 -->
    <div class="info_title">
      <div class="info_ss">
        <span class="cm">船名</span>
        <el-input placeholder="请输入船名"
                  size="small"
                  v-model="searchShipName"
                  class="inpt_width">
        </el-input>
        <span class="cm m10">日期</span>
        <el-date-picker
                v-model="searchDate"
                type="daterange"
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary"
                   size="mini"
                   @click="getTableData()"
                   style="margin-left: 10px;"
                   plain>查询</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="searchExport()"
                   plain>导出</el-button>
      </div>

      <el-table :data="tableData"
                :empty-text="emptyText"
                v-loading="loading"
                style="width: 100%;cursor:pointer;">
        <el-table-column prop="date"
                         label="日期">
        </el-table-column>
        <el-table-column prop="shipEn"
                         label="船名">
        </el-table-column>
      </el-table>

      <el-pagination
              background
              class="fl"
              layout="prev, pager, next"
              @size-change="getTableData"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="pagesize"
              :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      bgc: {
        backgroundImage: 'url(' + require('../../assets/tzxbgc.png') + ')'
      },
      searchShipName: '',
      searchDate: [],
      loading: true,
      emptyText: '加载中',
      tableData: [],
      total: 0,
      page: 1,
      pagesize: 20
    }
  },
  methods: {
    dateFormat(date){
      return new Date(date).toLocaleDateString().replace(/\//g,'-');
    },

    getSearchPar(){
      let [startDate,endDate] = (this.searchDate && (this.searchDate.length>0))?this.searchDate:[];
      let par = {
        startDate: (startDate?this.dateFormat(startDate):''),
        endDate: (endDate?this.dateFormat(endDate):''),
        name: (this.searchShipName?('%' + this.searchShipName + '%'):'')
      };
      return par;
    },

    searchExport(){
      let par = this.getSearchPar();
      this.$http.request({
        url:'/ship/exception/record/exportExcel',
        method: 'post',
        params: par,
        responseType: 'blob'
      }).then(response => {
        const file = response.headers['content-disposition']
        let filename = file.split('=')[1];
        let pos = filename.lastIndexOf('.');
        filename = 'Monitor' + new Date().getTime() + filename.substr(pos);
        this.download(response.data, filename);
      }).catch(error => {
        this.$message.error('导出错误！');
      });
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

    getTableData() {
      this.loading = true;
      let par = this.getSearchPar();
      par.page = this.page;
      par.num = this.pagesize;
      this.$http.request({
        url:'/ship/exception/record/get',
        method: 'post',
        params: par
      }).then(res => {
        if((res.status === 200) && (res.data.total>0)) {
          this.total = res.data.total;
          this.tableData = res.data.list;
        }
        this.emptyText = (this.total>0)?"":"暂无数据";
        this.loading = false;
      });
    },

    handleGotoLastPage() {
      let lastPage = Math.ceil(this.total/this.pagesize)
      this.handleCurrentChange(lastPage)
    },

    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
    },
  },

  created () {
    this.getTableData();
  },

  watch: {
    $route (to, from) {
      this.page = to.params.page - 0;
      this.getTableData();
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
.fl {
  float: right;
}
</style>