<script setup lang="ts">
  import { useProjectStore } from "@/stores/project";
  import { storeToRefs } from "pinia";
  import { onMounted, reactive, ref } from "vue";
  import moment from "moment";
  import { useQuasar, type QTableProps } from "quasar";
  import { Form, Field } from "vee-validate";
  import * as yup from "yup";
  import QInputWithValidation from "@/components/shared/QInputWithValidation.vue";

  const columns: QTableProps["columns"] = [
    {
      name: "name",
      label: "Імя",
      field: "name"
    },
    { name: "email", label: "E-mail", field: "user.email" },
    { name: "isOnline", label: "Статус", field: "isOnline" },
    {
      name: "chatsCount",
      label: "Кількість чатів",
      field: "chatsCount"
    },
    { name: "rating", label: "Рейтинг", field: "rating" },
    { name: "createdAt", label: "Створено", field: "user.email" },
    { name: "actions", label: "Дії", field: "actions" }
  ];

  const $q = useQuasar();
  const projectStore = useProjectStore();
  const { agents } = storeToRefs(projectStore);

  const isPasswordVisible = ref(false);

  const dialogs = reactive({
    create: false
  });

  const initialValues = {
    name: "",
    email: "",
    password: ""
  };

  onMounted(async () => {
    await projectStore.getAgents();
  });

  const schema = yup.object({
    email: yup
      .string()
      .required("Це поле обов`язкове")
      .email("Введіть коректний E-mail"),
    name: yup
      .string()
      .required("Це поле обов`язкове")
      .min(3, "Мінімальна довжина ${min} символи"),
    password: yup
      .string()
      .required("Це поле обов`язкове")
      .min(6, "Мінімальна довжина ${min} символи")
  });

  type Values = typeof schema.__outputType;

  async function onSubmit(values: Values) {
    await projectStore.createAgent(values);
    dialogs.create = false;
  }

  async function onDelete(id: number) {
    $q.dialog({
      title: "Видалити агента",
      message: "Ви спраді хочете видалити агента?",
      persistent: true,
      ok: "Так",
      cancel: {
        label: "Ні",
        color: "red",
        flat: true
      }
    })
      .onOk(async () => {
        await projectStore.deleteAgent(id);
      })
      .onDismiss(() => {
        return;
      });
  }
</script>
<template>
  <div class="container">
    <q-dialog v-model="dialogs.create" persistent>
      <q-card style="min-width: 550px">
        <Form
          :validation-schema="schema"
          :initialValues="initialValues"
          @submit="onSubmit"
        >
          <q-card-section>
            <div class="text-h6">Створити агента</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <Field name="name" v-slot="{ errorMessage, value, field }">
              <q-input-with-validation
                placeholder="І`мя"
                :model-value="value"
                :error-message="errorMessage"
                v-bind="field"
              >
                <template v-slot:prepend>
                  <q-icon name="badge"></q-icon>
                </template>
              </q-input-with-validation>
            </Field>
            <Field name="email" v-slot="{ errorMessage, value, field }">
              <q-input-with-validation
                placeholder="E-мейл"
                :model-value="value"
                :error-message="errorMessage"
                v-bind="field"
              >
                <template v-slot:prepend>
                  <q-icon name="email"></q-icon> </template
              ></q-input-with-validation>
            </Field>
            <Field name="password" v-slot="{ errorMessage, value, field }">
              <q-input-with-validation
                placeholder="Пароль"
                :model-value="value"
                :error-message="errorMessage"
                v-bind="field"
              >
                <template v-slot:prepend>
                  <q-icon name="lock"></q-icon>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="isPasswordVisible = !isPasswordVisible"
                  />
                </template>
              </q-input-with-validation>
            </Field>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat color="red" label="Відмінити" v-close-popup />
            <q-btn flat color="primary" label="Створити" type="submit" />
          </q-card-actions>
        </Form>
      </q-card>
    </q-dialog>

    <div class="header">
      <q-btn color="primary" @click="dialogs.create = true">Створити</q-btn>
    </div>

    <q-table
      title="Агенти"
      :pagination="{ sortBy: 'createdAt', descending: true, rowsPerPage: 20 }"
      rows-per-page-label="Записів на сторінку:"
      :rows-per-page-options="[10, 20, 50]"
      :rows="agents"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.user.email }}
          </q-td>
          <q-td key="isOnline" :props="props">
            <q-badge
              rounded
              :color="props.row.isOnline ? 'positive' : 'red'"
              label=" "
            />
          </q-td>
          <q-td key="chatsCount" :props="props">
            {{ props.row.chatsCount ?? 0 }}
          </q-td>
          <q-td key="rating" :props="props">
            <q-rating
              :model-value="props.row.rating ?? 0"
              readonly
              size="28px"
            />
            ({{ props.row.rating?.toFixed(1) ?? "0.0" }})
          </q-td>
          <q-td key="createdAt" :props="props">
            {{ moment(props.row.user.createdAt).format("DD.MM.YYYY") }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              color="red"
              icon="delete"
              @click="onDelete(props.row.id)"
              flat
            ></q-btn>
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
