<!--
 * @Author: Mr.Tian
 * @Date: 2021-12-30 17:40:14
 * @LastEditTime: 2022-01-04 16:58:57
 * @LastEditors: Mr.Tian
 * @Description: 
-->
<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select
          v-model="query.tag"
          placeholder="标签"
          class="handle-select mr10"
        >
          <el-option key="1" label="JavaScript" value="JavaScript"></el-option>
          <el-option key="2" label="reactjs" value="reactjs"></el-option>
          <el-option key="2" label="angularjs" value="angularjs"></el-option>
        </el-select>
        <el-input
          v-model="query.author"
          placeholder="作者"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-search" @click="handleReset"
          >重置</el-button
        >
      </div>
      <el-table :data="tableData" border style="width: 100%" ref="blogTable">
        <el-table-column
          label="序号"
          type="index"
          width="55"
          align="center"
        ></el-table-column>

        <el-table-column prop="title" label="标题" width="200" align="center" />
        <el-table-column
          prop="description"
          label="描述"
          width="150"
          align="center"
        />
        <el-table-column
          prop="tagList"
          label="标签"
          width="150"
          align="center"
        />
        <el-table-column prop="body" label="内容" width="150" align="center" />
        <el-table-column prop="author.username" label="作者" align="center" />
        <el-table-column
          prop="createdAt"
          label="创建时间"
          width="180"
          align="center"
        />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="openEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <div class="block">
          <el-pagination layout="prev, pager, next" :total="50"></el-pagination>
        </div>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>
    <edit-blog
      v-if="editParams.isShowEdit"
      :datas="editParams"
      @my-emit="parentEmit"
    ></edit-blog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { getArticle, deleteAtricle, getTags } from "../../api/index";
import moment from "moment";
import EditBlog from "./EditBlog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    EditBlog,
  },
  setup() {
    // 查询参数
    const query = reactive({
      pageIndex: 1,
      pageSize: 5,
      tag: [],
      author: null,
    });

    const tableData = ref([]); // 表格数据
    const pageTotal = ref(0); // 数据条数

    const editParams = reactive({
      isShowEdit: false,
      detailData: {},
      tagsList: [],
    });

    // 获取表格数据
    const getData = () => {
      getArticle(query).then((res) => {
        if (res) {
          let tableDatas = res.article;
          tableDatas.forEach((item) => {
            item.createdAt = moment(item.createdAt).format("YYYY-MM-DD");
          });
          tableData.value = tableDatas;
          pageTotal.value = res.articlesCount;
        }
      });
    };
    getData();

    // 获取标签
    const getTagList = () => {
      getTags().then((res) => {
        if (res) {
          editParams.tagsList = res.tags;
        }
      });
    };
    getTagList();

    // 搜索
    const handleSearch = () => {
      getData();
    };
    // 重置
    const handleReset = () => {
      query.tag = [];
      query.author = null;
      getData();
    };

    // 页数改变的函数
    const pageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 打开编辑弹窗
    const openEdit = (index, row) => {
      editParams.isShowEdit = true;
      editParams.detailData = row;
    };

    // 删除操作
    const handleDelete = (index, row) => {
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deleteAtricle(row._id).then((res) => {
            if (res.article) {
              ElMessage.success("删除成功");
              getData();
            } else {
              ElMessage.warning(res.error);
            }
          });
        })
        .catch(() => {});
    };

    // 处理关闭
    const parentEmit = (num) => {
      if (num == 1) {
        getData();
      }
      editParams.isShowEdit = false;
    };

    return {
      query,
      tableData,
      pageTotal,
      editParams,
      pageChange,
      handleSearch,
      handleReset,
      openEdit,
      handleDelete,
      parentEmit,
    };
  },
};
</script>

<style>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>