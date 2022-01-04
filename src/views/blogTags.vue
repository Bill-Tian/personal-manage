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
        :key="tag._id"
        closable
        @close="handleClose(tag)"
      >
        {{ tag.tagName }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue.tagName"
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
import { ElMessage } from "element-plus";
import { getTags, createTags, deleteTags } from "../api/index";
import { reactive, ref, nextTick } from "vue";
export default {
  name: "blogTags",

  setup() {
    // 标签数组
    const dynamicTags = ref([]);

    // 输入框
    const inputVisible = ref(false);

    const saveTagInput = ref(null);

    const inputValue = reactive({
      tagName: null,
    });

    // 获取标签
    const getTagList = () => {
      getTags().then((res) => {
        if (res) {
          dynamicTags.value = res.tags;
        }
      });
    };
    getTagList();

    // 新增确认
    const handleInputConfirm = () => {
      if (inputValue.tagName) {
        addTags();
      }
      inputVisible.value = false;
      inputValue.tagName = "";
    };

    // 新增标签
    const addTags = () => {
      createTags({ tags: inputValue }).then((res) => {
        if (res.tags) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
          getTagList();
        }
      });
    };

    // 删除标签
    const handleClose = (tag) => {
      deleteTags(tag._id).then((res) => {
        if (res.tags) {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          getTagList();
        }
      });
    };

    const showInput = () => {
      inputVisible.value = true;
      nextTick(() => {
        saveTagInput.value.input.focus();
      });
    };

    return {
      inputValue,
      inputVisible,
      dynamicTags,
      saveTagInput,
      getTagList,
      addTags,
      handleInputConfirm,
      handleClose,
      showInput,
    };
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