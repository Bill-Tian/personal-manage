<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-redpacket_fill"></i> 博客标签
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tag
        v-for="tag in dynamicTags"
        :key="tag.id"
        closable
        @close="handleClose(tag)"
      >
        {{ tag.blog_tag_name }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        size="mini"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput"
        >+ 新增标签</el-button
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
export default {
  name: "blogTags",
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  mounted() {
    this.getTagList();
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        // this.dynamicTags.push(inputValue);
        this.addTags();
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    // 获取标签
    getTagList() {
      axios.get("/api/blogtag/findBlogTag").then((res) => {
        if (res.data.results) {
          this.dynamicTags = res.data.results;
        }
      });
    },

    // 新增标签
    addTags() {
      const param = { blog_tag_name: this.inputValue };
      axios.post("/api/blogtag/addBlogTag", param).then((res) => {
        if (res.data.results.affectedRows == 1) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
          this.getTagList();
        }
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>