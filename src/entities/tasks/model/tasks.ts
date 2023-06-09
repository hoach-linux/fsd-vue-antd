import axios from "axios";
import { defineStore } from "pinia";
import { nextTick, reactive, ref } from "vue";

interface ITaskItem {
  id?: number;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  date_time: string;
  checked: boolean;
}

export const useTaskStore = defineStore("tasks", () => {
  const listItems = ref<object[]>([]);
  const listItemsFinished = ref<object[]>([]);
  const listItemsUnFinished = ref<object[]>([]);
  let taskItem = reactive<ITaskItem>({
    title: "",
    description: "",
    date_start: "",
    date_end: "",
    checked: false,
    date_time: "",
  });
  const loading = ref(false);
  const url = `${import.meta.env.VITE_APP_API_URL}`;

  async function getTaskList() {
    try {
      loading.value = true;

      let taskList = await axios.get(url);

      listItems.value = await taskList.data.data;
      loading.value = false;
    } catch (error: any) {
      console.log(error.message);
    }
  }
  async function getTaskById(id: string | string[]) {
    try {
      loading.value = true;

      let response = await axios.get(`${url}/${id}`);
      let item = response.data.data;

      taskItem.title = item.title;
      taskItem.id = item.id;
      taskItem.description = item.description;
      taskItem.date_start = item.date_start;
      taskItem.date_end = item.date_end;
      taskItem.checked = item.checked;
      taskItem.date_time = item.date_time;

      await nextTick();

      loading.value = false;
    } catch (error: any) {
      console.log(error.message);
    }
  }
  async function getFinishedTaskList() {
    try {
      loading.value = true;

      let taskList = await axios.get(url, {
        params: {
          filter: {
            checked: {
              _eq: "true",
            },
          },
        },
      });

      listItemsFinished.value = await taskList.data.data;
      loading.value = false;
    } catch (error: any) {
      console.log(error.message);
    }
  }
  async function getUnFinishedTaskList() {
    try {
      loading.value = true;

      let taskList = await axios.get(url, {
        params: {
          filter: {
            checked: {
              _eq: "false",
            },
          },
        },
      });

      listItemsUnFinished.value = await taskList.data.data;
      loading.value = false;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return {
    listItems,
    listItemsUnFinished,
    taskItem,
    getTaskList,
    getFinishedTaskList,
    getUnFinishedTaskList,
    getTaskById,
    loading,
    listItemsFinished,
  };
});
