<!--
 * @Author: Mr.Tian
 * @Date: 2021-12-15 11:22:00
 * @LastEditTime: 2022-01-04 16:43:58
 * @LastEditors: Mr.Tian
 * @Description: 
-->
<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 表单
        </el-breadcrumb-item>
        <el-breadcrumb-item>MarkDown</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="form-boxs">
        <el-form :model="ruleForm" ref="dom" :rules="rules" label-width="120px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="ruleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="图片地址" prop="imgName">
            <el-input
              v-model="ruleForm.imgName"
              placeholder="图片名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签" prop="tagList">
            <el-checkbox-group v-model="ruleForm.tagList">
              <el-checkbox
                v-for="item in tagsList"
                :key="item._id"
                :label="item.tagName"
                >{{ item.tagName }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="内容" class="content" prop="body">
            <mavon-editor
              :codeStyle="codeStyle"
              v-model="ruleForm.body"
              :ishljs="true"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { createArticle, getTags } from "../api/index";
export default {
  setup() {
    const codeStyle = ref("monokai-sublime");
    const tagsList = ref([]);

    const ruleForm = reactive({
      title: "",
      imgName: "",
      description: "",
      tagList: [],
      body: "",
    });
    const rules = {
      title: [
        {
          required: true,
          message: "请输入博客标题",
          trigger: "blur",
        },
        {
          min: 1,
          max: 30,
          message: "博客标题长度最大为30",
          trigger: "blur",
        },
      ],
      imgName: [
        {
          required: true,
          message: "请输入图片名称",
          trigger: "blur",
        },
      ],
      description: [
        {
          required: true,
          message: "描述不能为空",
          trigger: "blur",
        },
      ],
      tagList: [
        {
          type: "array",
          required: true,
          message: "Please select at least one activity type",
          trigger: "change",
        },
      ],
      body: [
        {
          required: true,
          message: "请输入文档内容",
          trigger: "blur",
        },
      ],
    };

    // 表单元素
    const dom = ref(null);

    // 提交按钮
    const onSubmit = () => {
      dom.value.validate((valid) => {
        if (valid) {
          addBlog();
        } else {
          return false;
        }
      });
    };

    // 新增博客方法
    const addBlog = () => {
      createArticle({ article: ruleForm }).then((res) => {
        if (res) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
        } else {
          ElMessage({
            message: res,
            type: "error",
          });
        }
      });
    };

    // 获取标签
    const getTagList = () => {
      getTags().then((res) => {
        if (res) {
          tagsList.value = res.tags;
        }
      });
    };
    getTagList();

    return {
      ruleForm,
      rules,
      dom,
      codeStyle,
      tagsList,
      onSubmit,
      addBlog,
    };
  },
};
</script>

<style>
.content {
  padding-bottom: 20px;
}
</style>