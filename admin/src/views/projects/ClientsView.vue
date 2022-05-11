<script setup lang="ts">
  import { useProjectStore } from "@/stores/project";
  import { storeToRefs } from "pinia";
  import { onMounted } from "vue";
  import moment from "moment";

  const columns = [
    {
      name: "name",
      label: "Ім'я",
      field: "name"
    },
    { name: "email", label: "E-mail", field: "email" },
    {
      name: "phone",
      label: "Телефон",
      field: "phone"
    },
    {
      name: "createdAt",
      label: "Дата чату",
      field: "createdAt",
      sortable: true
    }
  ];

  const projectStore = useProjectStore();
  const { clients } = storeToRefs(projectStore);

  onMounted(async () => {
    await projectStore.getClients();
  });
</script>
<template>
  <div class="container">
    <q-table
      :pagination="{ sortBy: 'createdAt', descending: true, rowsPerPage: 20 }"
      rows-per-page-label="Записів на сторінку:"
      :rows-per-page-options="[10, 20, 50]"
      title="Клієнти"
      :rows="clients"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone || "Не вказано" }}
          </q-td>
          <q-td key="createdAt" :props="props">
            {{ moment(props.row.createdAt).format("DD.MM.YYYY") }}
          </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data>
        <div
          class="full-width row flex-center text-black q-gutter-sm text-body1 q-py-lg"
        >
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>Нічого не знайдено</span>
        </div>
      </template>
    </q-table>
  </div>
</template>
<style lang="scss" scoped>
  .container {
    padding: 50px 0 0;
    margin: 0 auto;
    max-width: 1140px;

    .header {
      display: flex;
      justify-content: flex-end;
      margin: 15px 0;
    }
  }
</style>
