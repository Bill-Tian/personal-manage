<!--
 * @Author: Mr.Tian
 * @Date: 2022-01-27 10:53:19
 * @LastEditTime: 2022-02-08 17:56:43
 * @LastEditors: Mr.Tian
 * @Description: 
-->
<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-redpacket_fill"></i> 音乐管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container main-box">
      <div id="aplayer"></div>

      <div class="searchOne">
        <el-input
          v-model="inputValue"
          placeholder="输入歌名搜索"
          class="searchInput"
        ></el-input>
        <el-button @click="search">搜索</el-button>

        <el-select
          v-model="selectValue"
          @change="topChange"
          class="m-select"
          placeholder="Select"
        >
          <el-option
            v-for="item in topList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="list-box">
        <el-table
          :data="
            searchList.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          stripe
          style="width: 100%"
        >
          <el-table-column prop="name" label="歌名" />
          <el-table-column prop="artist" label="歌手" />
          <el-table-column label="头像" align="center">
            <template #default="scope">
              <el-image
                class="table-td-thumb"
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="专辑">
            <template #default="scope">
              <span>《{{ scope.row.album }}》</span>
            </template>
          </el-table-column>
          <el-table-column label="时长">
            <template #default="scope">
              {{ Math.floor(scope.row.duration / 1000 / 60) }}:{{
                Math.round((scope.row.duration / 1000) % 60)
              }}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                title="添加到播放列表"
                size="small"
                @click="addMusicList(1, scope.$index, scope.row)"
              >
                <span>+</span>
              </el-button>
              <el-button
                title="播放"
                size="small"
                @click="play(2, scope.$index, scope.row)"
              >
                播放
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagina"
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :total="searchList.length"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  searchMusic,
  addMusic,
  getMusicList,
  getHotList,
} from "../../api/index";
import APlayer from "aplayer";
import "aplayer/dist/APlayer.min.css";
import { ElMessage } from "element-plus";
export default {
  setup() {
    let aplayer;
    const inputValue = ref(null);
    const selectValue = ref(1);
    const searchList = ref([]);

    const currentPage = ref(1); // 初始页
    const pagesize = ref(5); // 每页的数据

    const topList = ref([
      { label: "热歌榜", value: 1 },
      { label: "飙升榜", value: 3 },
      { label: "新歌榜", value: 0 },
      { label: "原创榜", value: 2 },
    ]);

    const musicData = reactive({
      musicId: "",
      name: "",
      artist: "",
      url: "",
      cover: "",
    });

    // 搜索
    const search = () => {
      const value = inputValue.value;
      searchMusic(value).then((res) => {
        if (res.status == 200) {
          let songsList = res.body.result.songs;
          searchList.value = songsList.map((item) => {
            const artistAry = item.artists.map((art) => {
              return art.name;
            });
            const oneartist = artistAry.join("/");
            return {
              musicId: item.id,
              name: item.name,
              artist: oneartist,
              url: `http://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
              album: item.album.name,
              duration: item.duration,
            };
          });
        }
      });
    };

    // 添加音乐到播放列表
    const addMusicList = (num, index, row) => {
      Object.keys(musicData).forEach((item) => {
        musicData[item] = row[item];
      });
      addMusic({ music: musicData }).then((res) => {
        if (res) {
          aplayer.list.add(res.music);
          if (num == 1) {
            ElMessage.success("添加成功");
          } else if (num == 2) {
            ElMessage.success("播放成功");
            let currentMusic = aplayer.list.audios.length;
            aplayer.list.switch(currentMusic - 1);
            aplayer.play();
          }
        }
      });
    };

    // 播放
    const play = (nums, index, row) => {
      addMusicList(nums, index, row);
    };

    // 获取热门音乐列表
    const getHot = () => {
      getHotList(selectValue.value).then((res) => {
        if (res.status == 200) {
          let hotList = res.body.playlist.tracks;
          searchList.value = hotList.map((item) => {
            const artistAry = item.ar.map((art) => {
              return art.name;
            });
            const oneartist = artistAry.join("/");
            return {
              musicId: item.id,
              name: item.name,
              artist: oneartist,
              url: `http://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
              album: item.al.name,
              duration: item.dt,
              cover: item.al.picUrl + "?param=300x300",
            };
          });
        }
      });
    };
    getHot();

    // Top榜单变化监听
    const topChange = () => {
      console.log(selectValue.value);
      getHot();
    };
    // 页码变化
    const handleCurrentChange = (page) => {
      currentPage.value = page;
    };

    // 获取音乐列表
    const getMusic = () => {
      getMusicList().then((res) => {
        if (res) {
          aplayer.list.clear();
          aplayer.list.add(res.music);
        }
      });
    };
    getMusic();

    onMounted(() => {
      aplayer = new APlayer({
        container: document.getElementById("aplayer"),
        listFolded: true,
        listMaxHeight: "164px",
        lrcType: 1,
        audio: [],
      });
    });

    return {
      currentPage,
      pagesize,
      inputValue,
      selectValue,
      topList,
      searchList,
      search,
      addMusicList,
      topChange,
      handleCurrentChange,
      play,
    };
  },
};
</script>

<style >
.main-box {
  padding: 10px 30px;
}
.searchOne {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  position: relative;
}
.m-select {
  position: absolute;
  right: 0px;
  width: 120px;
}
.searchInput {
  width: 240px;
  margin-right: 10px;
}
.list-box {
  margin-top: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
.pagina {
  text-align: right;
  margin-top: 5px;
}
</style>