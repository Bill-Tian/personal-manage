<!--
 * @Author: Mr.Tian
 * @Date: 2021-12-23 14:24:47
 * @LastEditTime: 2022-01-04 17:11:58
 * @LastEditors: Mr.Tian
 * @Description: 
-->
<template>
  <!--blog编辑-->
  <el-dialog
    v-model="isShowEdit"
    title="博客编辑"
    width="80%"
    @close="closeEdit"
  >
    <el-form ref="dom" :model="form" label-width="120px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-input v-model="form.imgName" placeholder="图片名称"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-checkbox-group v-model="form.tagList">
          <el-checkbox v-for="item in tagLists" :key="item" :label="item">{{
            item
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="内容" class="body">
        <mavon-editor
          :codeStyle="codeStyle"
          v-model="form.body"
          :ishljs="true"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEdit">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive } from "vue";
import { updateAtricle } from "../../api/index";
import { ElMessage } from "element-plus";

export default {
  props: {
    datas: {},
  },
  emits: ["my-emit"],

  setup(props, { emit }) {
    const codeStyle = ref("monokai-sublime");

    const form = reactive({
      title: "",
      imgName: "",
      description: "",
      tagList: [],
      body: "",
    });

    const datas = reactive(props.datas);

    const isShowEdit = ref(datas.isShowEdit);

    const lists = ref(datas.tagsList);
    const tagLists = lists.value.map((item) => {
      return item.tagName;
    });

    Object.keys(form).forEach((item) => {
      form[item] = datas.detailData[item];
    });

    // 传给父组件处理关闭
    const closeEdit = (num) => {
      emit("my-emit", num);
    };

    // 保存编辑
    const saveEdit = () => {
      const id = datas.detailData._id;
      updateAtricle(id, { article: form }).then((res) => {
        console.log(res);
        if (res.article) {
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          closeEdit(1);
        } else {
          ElMessage({
            message: res.error || res.error.message,
            type: "warning",
          });
        }
      });
    };

    return {
      codeStyle,
      form,
      isShowEdit,
      tagLists,
      closeEdit,
      saveEdit,
    };
  },
};
</script>

<style>
</style>