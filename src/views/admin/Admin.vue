<!--
 * @Author: Mr.Tian
 * @Date: 2021-12-29 14:11:02
 * @LastEditTime: 2022-01-04 14:30:09
 * @LastEditors: Mr.Tian
 * @Description: 
-->
<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 管理员设置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box"></div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          label="序号"
          type="index"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column label="头像(查看大图)" align="center">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="bio" label="简介"></el-table-column>

        <el-table-column prop="createdAt" label="注册时间"></el-table-column>
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
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.bio"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import axios from "axios";
import moment from "moment";
import { updateUser, deleteUser } from "../../api/index";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  setup() {
    const form = reactive({
      username: "",
      email: "",
      bio: "",
      _id: "",
    });

    const tableData = ref([]); // 表格数据
    const editVisible = ref(false); // 编辑弹窗

    // 获取表格数据
    const getData = () => {
      axios.get("/api/allUser").then((res) => {
        if (res.status == 200) {
          let tableDatas = res.data.users;
          tableDatas.forEach((item) => {
            item.createdAt = moment(item.createdAt).format("YYYY-MM-DD");
          });
          tableData.value = tableDatas;
        }
      });
    };
    getData();

    // 打开弹窗渲染数据
    const handleEdit = (index, row) => {
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };

    // 更新保存
    const saveEdit = () => {
      updateUser({ user: form }).then((res) => {
        if (res.user) {
          ElMessage.success("修改成功");
          editVisible.value = false;
          getData();
        }
      });
    };

    // 删除用户
    const handleDelete = (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deleteUser({ id: row._id }).then((res) => {
            if (res) {
              ElMessage.success("删除成功");
              getData();
            }
          });
        })
        .catch(() => {});
    };

    return {
      tableData,
      editVisible,
      form,
      handleEdit,
      saveEdit,
      handleDelete,
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