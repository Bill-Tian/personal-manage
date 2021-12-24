<!--
 * @Author: Mr.Tian
 * @Date: 2021-12-23 14:24:47
 * @LastEditTime: 2021-12-24 10:04:48
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
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="发表日期">
        <el-col :span="11">
          <el-date-picker
            v-model="form.create_date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="图片地址">
        <el-input
          v-model="form.img_url"
          placeholder="https://cdn.jsdelivr.net/gh/Bill-Tian/Picture-library/img/Avatar/"
        ></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <!-- <el-checkbox-group v-model="form.tags">
          <el-checkbox
            v-for="item in tagsList"
            :key="item.id"
            :label="item.id"
            >{{ item.blog_tag_name }}</el-checkbox
          >
        </el-checkbox-group> -->
      </el-form-item>
      <el-form-item label="内容" class="content">
        <mavon-editor
          :codeStyle="codeStyle"
          v-model="form.content"
          :ishljs="true"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEdit">取消</el-button>
        <el-button type="primary" @click="closeEdit = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive } from "vue";
export default {
  props: {
    datas: {},
  },

  setup(props, { emit }) {
    const form = reactive({
      create_date: "",
      title: "",
      thumb_up: "",
      heat: "",
      img_url: "",
      content: "",
      blogTagName: [],
    });

    const datas = reactive(props.datas);

    const isShowEdit = ref(datas.isShowEdit);

    // form.value = datas.detailData;

    Object.keys(form).forEach((item) => {
      form[item] = datas.detailData[item];
    });

    const closeEdit = () => {
      emit("my-emit");
    };
    console.log(form.value);

    return {
      form,
      isShowEdit,
      closeEdit,
    };
  },
};
</script>

<style>
</style>