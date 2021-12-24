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
          v-model="query.address"
          placeholder="地址"
          class="handle-select mr10"
        >
          <el-option key="1" label="广东省" value="广东省"></el-option>
          <el-option key="2" label="湖南省" value="湖南省"></el-option>
        </el-select>
        <el-input
          v-model="query.name"
          placeholder="用户名"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column label="账户余额">
          <template #default="scope">￥{{ scope.row.money }}</template>
        </el-table-column>
        <el-table-column label="头像(查看大图)" align="center">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.thumb"
              :preview-src-list="[scope.row.thumb]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.state === '成功'
                  ? 'success'
                  : scope.row.state === '失败'
                  ? 'danger'
                  : ''
              "
              >{{ scope.row.state }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="date" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
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
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--new-->
    <div class="container">
      <el-table :data="tableData2" border style="width: 100%" ref="blogTable">
        <el-table-column
          label="序号"
          type="index"
          width="55"
          align="center"
        ></el-table-column>

        <el-table-column prop="title" label="标题" width="200" align="center" />
        <el-table-column prop="heat" label="热度" width="150" align="center" />
        <el-table-column prop="heat" label="标签" width="150" align="center" />
        <el-table-column label="图片" align="center">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.img_url"
              :preview-src-list="[scope.row.img_url]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_date"
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
          :page-size="5"
          :total="dataCount"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>

    <edit-blog
      v-if="params.isShowEdit"
      :datas="params"
      @my-emit="parentEmit"
    ></edit-blog>

    <!-- <mavon-editor
      class="md"
      v-model="tableData2[1].content"
      :subfield="false"
      defaultOpen="preview"
      :toolbarsFlag="false"
      :editable="false"
      :scrollStyle="true"
      :ishljs="true"
    ></mavon-editor> -->
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";
import axios from "axios";
import moment from "moment";
import EditBlog from "./blogs/EditBlog.vue";

export default {
  components: { EditBlog },
  name: "basetable",
  setup() {
    const query = reactive({
      address: "",
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    console.log(pageTotal);
    // 获取表格数据
    const getData = () => {
      fetchData(query).then((res) => {
        tableData.value = res.list;
        pageTotal.value = res.pageTotal || 50;
      });
    };
    getData();

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      name: "",
      address: "",
    });
    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      Object.keys(form).forEach((item) => {
        tableData.value[idx][item] = form[item];
      });
    };

    const params = reactive({
      isShowEdit: false,
      detailData: {},
    });

    // const isShowEdit = ref(false);

    const openEdit = (index, row) => {
      params.isShowEdit = true;
      params.detailData = row;

      // isShowEdit.value = true;
    };

    // provide("mmm", params);

    const parentEmit = () => {
      params.isShowEdit = false;
    };

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      params,
      // isShowEdit,
      // form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      openEdit,
      parentEmit,
    };
  },
  data() {
    return {
      dialogFormVisible: false,
      pageNum: 0,
      dataCount: 0,
      tableData2: [
        {
          create_date: "2021-12-16T16:00:00.000Z",
          title: "sdsd",
          thumb_up: "2",
          heat: "2000",
          img_url:
            "https://cdn.jsdelivr.net/gh/Bill-Tian/Picture-library/img/Avatar/blog.jpg",
          content: 12312,
        },
      ],

      tagsList: [],
      form: {
        create_date: "",
        title: "",
        thumb_up: "",
        heat: "",
        img_url: "",
        content: "",
        tags: [],
      },
    };
  },
  mounted() {
    // this.tableData2.forEach((item) => {
    //   item.create_date = moment(item.create_date).format("YYYY-MM-DD");
    // });
    this.getListOfData();
    this.getTagList();
  },
  methods: {
    pageChange(val) {
      this.pageNum = val - 1;
      this.getListOfData();
    },

    // 获取blog表格数据
    getListOfData() {
      const param = {
        page: this.pageNum,
        pageSize: 5,
      };
      axios.post("/api/blog/findBlogBypage", param).then((res) => {
        this.tableData2 = res.data.results;
        this.dataCount = res.data.count;
        this.tableData2.forEach((item) => {
          item.create_date = moment(item.create_date).format("YYYY-MM-DD");
        });
      });
    },

    openBlogEdit(index, row) {
      console.log(index);
      console.log(row);
      this.dialogFormVisible = true;
      this.form = row;
    },

    // 获取标签
    getTagList() {
      axios.get("/api/blogtag/findBlogTag").then((res) => {
        if (res.data.results) {
          this.tagsList = res.data.results;
          console.log(this.tagsList);
        }
      });
    },
  },
};
</script>

<style scoped>
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
