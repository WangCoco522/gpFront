<template>
    <div>
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
            <el-table-column fixed  label="序号">
                <template #default="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名"/>
            <el-table-column prop="manufacturerName" label="所属厂商"/>
            <el-table-column :formatter="formatActivate" label="是否启用"/>
            <el-table-column :formatter="formatAdmin" label="是否为管理员"/>
            <el-table-column prop="updateTime" label="修改时间"/>
            <el-table-column fixed="right" label="操作" width="480">

            <template #default="{row}">
                <el-button text type="primary" size="small" @click="handleModifyPassword(row.id)">修改密码</el-button>
                <el-button link type="success" size="small" @click="handleEnable(row.id)">启用</el-button>
                <el-button link type="warning" size="small" @click="handleUnable(row.id)">禁用</el-button>
                <el-button link type="primary" size="small" @click="handleDelete(row.id)">删除</el-button>
            </template>

            </el-table-column>
        </el-table>

    <div class="footer-stats">
        <div></div>
        <span>共有：{{ tableData.length}} 条数据</span>
        <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>    




    </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import { ElMessage} from 'element-plus';
import { UserConstant } from '../../common/constant';


export default {
    setup() {
        const axiosInstance = axios.create({
            withCredentials: false,
        });

        const tableData = ref([]);
        const totalCount = ref(0);
        const pageSize = ref(10);
        const isAdmin = ref(false);
        const currentPage = ref(1);
        const modifyPasswordVisible = ref(false);
        const modifyPasswordForm = ref({
            id: 0,
            newPassword: '',
        });

        const modifyPasswordRule = ref({
            newPassword: [
                {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur',
                },
            ],
        });

        const modifyingPassword = ref(false);

        const getUserList = () => {
            const params = {
                currentPage: currentPage.value,
                pageSize: pageSize.value,
                username: localStorage.getItem(UserConstant.USERNAME),
            };
            
            axiosInstance.get(window.g.url + '/user/list', {
                headers: {
                    Authorization: localStorage.getItem(UserConstant.TOKEN),
                },
                params: params,
            })
            .then((resp) => {
                tableData.value = resp.data.data.list;
                totalCount.value = resp.data.data.totalCount;
                isAdmin.value = resp.data.data.extraInfo['isAdmin'];
            });
        }

        const handleCurrentChange = (val) => {
            currentPage.value = val;
            getUserList();
        }


        const handleModifyPassword = (id) => {
            console.log("handleModifyPassword called with id:", id);
            modifyPasswordForm.value.id = id;
            modifyPasswordVisible.value = true;
        };

        const modifyPassword = () => {
            modifyingPassword.value = true;
            const form = new FormData();
            form.append('id', String(modifyPasswordForm.value.id));
            form.append('newPassword', modifyPasswordForm.value.newPassword);
            
            axiosInstance.put(window.g.url + '/user/password', form, {
                headers: {
                    Authorization: localStorage.getItem(UserConstant.TOKEN),
                },
            })
            .then((resp) => {
                if (resp.data.code === 0) {
                    ElMessage({
                        message: '密码修改成功！',
                        type: 'success',
                    });
                } else {
                    ElMessage.error('密码修改失败,错误原因:' + resp.data.msg);
                }
                modifyingPassword.value = false;
                modifyPasswordVisible.value = false;
            });
        }


        const handleEnable = (id) => {
            axiosInstance
                .put(
                    window.g.url + '/user/enable/' + id,
                    {},
                    {
                        headers: {
                            Authorization: localStorage.getItem(UserConstant.TOKEN),
                        },
                    }
                )
                .then((resp) => {
                    if (resp.data.code !== 0) {
                        ElMessage.error('启用失败!');
                        return;
                    }
                    ElMessage({
                        message: '启用成功！',
                        type: 'success',
                    });
                    getUserList();
                });
        }

        const handleUnable = (id) => {
          axiosInstance
            .put(
              window.g.url + '/user/unable/' + id,
              {},
              {
                headers: {
                  Authorization: localStorage.getItem(UserConstant.TOKEN),
                },
              }
            )
            .then((resp) => {
              if (resp.data.code !== 0) {
                ElMessage.error('禁用失败!');
                return;
              }
              ElMessage({
                message: '禁用成功！',
                type: 'success',
              });
              getUserList();
            });
        };

        const handleDelete = (id) => {
          ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
          })
          .then(() => {
              axiosInstance
              .delete(window.g.url + '/user/remove/' + id, {
                  headers: {
                      Authorization: localStorage.getItem(UserConstant.TOKEN),
                  },
              })
              .then((resp) => {
                  if (resp.data.code !== 0) {
                      ElMessage.error('删除失败!');
                      return;
                  }
                  ElMessage({
                      message: '删除成功！',
                      type: 'success',
                  });
                  getUserList();
              });
          })
          .catch(() => {
              ElMessage({
                  type: 'info',
                  message: '已取消删除',
              });
          });
      }

      const formatActivate = (row) => row.enable ? '是' : '否';
      const formatAdmin = (row) => row.admin ? '是' : '否';

      const mounted = () => {
          getUserList();
      };

      onMounted(mounted);


      return {
          tableData,
          formatActivate,
          formatAdmin,
          modifyPasswordRule,
          handleModifyPassword,
          modifyPassword,
          handleEnable,
          handleUnable,
          handleDelete,
          handleCurrentChange,
      };
    }
}
</script>

<style>

.footer-stats{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #fff;
}

.footer-stats > span {
    margin-right: 10px;
}



</style>
