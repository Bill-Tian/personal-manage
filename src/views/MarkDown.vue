<!--
 * @Author: Mr.Tian
 * @Date: 2021-12-15 11:22:00
 * @LastEditTime: 2021-12-16 14:29:14
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
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="标题">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="发表日期">
            <el-col :span="11">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="Pick a date"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="图片地址">
            <el-input
              v-model="form.imgurl"
              placeholder="https://cdn.jsdelivr.net/gh/Bill-Tian/Picture-library/img/Avatar/"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="form.tags" clearable placeholder="选择标签">
              <el-option
                v-for="item in tagsList"
                :key="item.id"
                :label="item.blog_tag_name"
                :value="item.blog_tag_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容" class="content">
            <mavon-editor
              :codeStyle="codeStyle"
              v-model="form.content"
              :ishljs="true"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Create</el-button>
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

      form: {
        name: "",
        imgurl: "",
        date1: "",
        tags: "",
        content: "",
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
      const param = {
        create_date: this.form.date1,
        title: this.form.name,
        thumb_up: "2",
        heat: "2000",
        img_url: this.form.imgurl,
        content: this.form.content,
        // blog_tag_id: this.form.tags,
      };
      axios.post("/api/blog/addBlog", param).then((res) => {
        if (res.data.results.affectedRows == 1) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
        }
      });
    },
  },
};
</script>

<style>
</style>