<script lang="ts" setup>
  import { useProjectStore } from "@/stores/project";
  import { storeToRefs } from "pinia";
  import { LineChart } from "vue-chart-3";
  import { Chart, registerables } from "chart.js";
  import { onMounted, computed } from "vue";
  import moment from "moment";

  Chart.register(...registerables);

  const projectStore = useProjectStore();
  const { statistic } = storeToRefs(projectStore);

  onMounted(async () => {
    await projectStore.getStatistic();
  });

  function groupByDate(
    array: any[] = [],
    accumulator = {}
  ): Record<string, number> {
    return array.reduce((total, current) => {
      const key = moment(current.createdAt).format("DD/MM");
      total[key] = total[key] ? total[key] + 1 : 1;
      return total;
    }, accumulator);
  }

  function createLabelsForWeek() {
    const dates: Record<string, number> = {};
    let start = moment().subtract(6, "day");

    for (let i = 0; i < 7; i++) {
      const key = start.format("DD/MM");
      dates[key] = 0;
      start = start.add(1, "day");
    }

    return dates;
  }

  const chatsData = computed(() => {
    const data = Object.values(
      groupByDate(statistic.value.chats, createLabelsForWeek())
    );
    const labels = Object.keys(createLabelsForWeek());

    return {
      labels,
      datasets: [
        {
          label: "Чати",
          data: data,
          borderColor: "#5eb5f7",
          backgroundColor: "#5eb5f7"
        }
      ]
    };
  });

  const clientsData = computed(() => {
    const data = Object.values(
      groupByDate(statistic.value.clients, createLabelsForWeek())
    );

    const labels = Object.keys(createLabelsForWeek());

    return {
      labels,
      datasets: [
        {
          label: "Клієнти",
          data: data,
          borderColor: "#5eb5f7",
          backgroundColor: "#5eb5f7"
        }
      ]
    };
  });
</script>
<template>
  <div class="container" v-if="statistic?.chats.length">
    <h6 class="q-my-sm text-grey">
      <q-icon name="chat_bubble" size="28px" />
      <span class="q-pl-md">Чати за останній тиждень</span>
    </h6>

    <LineChart :chart-data="chatsData" />
  </div>

  <div class="container" v-if="statistic?.clients.length">
    <h6 class="q-my-sm text-grey">
      <q-icon name="account_circle" size="28px" />
      <span class="q-pl-md">Клієнти за останній тиждень</span>
    </h6>
    <LineChart :chart-data="clientsData" />
  </div>
</template>
<style lang="scss" scoped>
  .container {
    padding: 150px 0 0;
    margin: 50px auto;
    max-width: 940px;
    background: #fff;
    padding: 15px 30px;
    border-radius: 15px;

    .header {
      display: flex;
      justify-content: flex-end;
      margin: 15px 0;
    }
  }
</style>
