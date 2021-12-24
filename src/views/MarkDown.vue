<!--
 * @Author: Mr.Tian
 * @Date: 2021-12-15 11:22:00
 * @LastEditTime: 2021-12-23 11:52:56
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
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="标题" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="发表日期" prop="date1">
            <el-col :span="11">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                placeholder="Pick a date"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="图片地址" prop="imgurl">
            <el-input
              v-model="ruleForm.imgurl"
              placeholder="https://cdn.jsdelivr.net/gh/Bill-Tian/Picture-library/img/Avatar/"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签" prop="tags">
            <el-checkbox-group v-model="ruleForm.tags">
              <el-checkbox
                v-for="item in tagsList"
                :key="item.id"
                :label="item.id"
                >{{ item.blog_tag_name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="内容" class="content" prop="content">
            <mavon-editor
              :codeStyle="codeStyle"
              v-model="ruleForm.content"
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
import axios from "axios";
import { ElMessage } from "element-plus";
export default {
  name: "markdown",
  data() {
    return {
      handbook: "",
      codeStyle: "monokai-sublime", //主题
      tagsList: [],
      ruleForm: {
        name: "",
        imgurl: "",
        date1: "",
        tags: [],
        content: "",
      },

      rules: {
        name: [
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
        imgurl: [
          {
            required: true,
            message: "请输入图片地址",
            trigger: "blur",
          },
        ],
        tags: [
          {
            type: "array",
            required: true,
            message: "请选择标签",
            trigger: "change",
          },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入文档内容",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getTagList();
  },
  methods: {
    // 获取标签
    getTagList() {
      axios.get("/api/blogtag/findBlogTag").then((res) => {
        if (res.data.results) {
          this.tagsList = res.data.results;
        }
      });
    },

    onSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.addBlog();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 新增博客的方法
    addBlog() {
      const param = {
        create_date: this.ruleForm.date1,
        title: this.ruleForm.name,
        thumb_up: "0",
        heat: "0",
        img_url: this.ruleForm.imgurl,
        content: this.ruleForm.content,
        blogtag_id: this.ruleForm.tags,
      };
      axios.post("/api/blog/addBlog", param).then((res) => {
        if (res.data.results.affectedRows == 1) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
        } else {
          ElMessage({
            message: res.data.results.text,
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style>
.content {
  padding-bottom: 20px;
}
</style>