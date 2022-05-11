<script setup lang="ts">
  import { useQuasar } from "quasar";
  import { computed, onMounted, ref } from "vue";
  import type { Handbook } from "@/types";
  import { useProjectStore } from "@/stores/project";
  import { storeToRefs } from "pinia";
  import Loading from "@/components/agent/Loading.vue";
  import * as yup from "yup";
  import { Form, Field } from "vee-validate";
  import QInputWithValidation from "@/components/shared/QInputWithValidation.vue";

  const isCreatingDialogVisible = ref(false);

  const $q = useQuasar();

  const projectStore = useProjectStore();

  const isLoading = ref(false);
  const draft = ref("");

  onMounted(async () => {
    isLoading.value = true;
    await projectStore.getHandbooks();
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  });

  const { handbooks } = storeToRefs(projectStore);

  const search = ref("");

  const selectedEditingId = ref<null | number>(null);

  async function onCopy(handbook: Handbook) {
    await navigator.clipboard.writeText(handbook.answer);
    $q.notify({
      message: "Скопійовано!",
      icon: "content_copy"
    });
  }

  const filtered = computed(() => {
    return handbooks.value.filter(
      handbook => handbook.question.indexOf(search.value) !== -1
    );
  });

  const initialValues = {
    question: "",
    answer: ""
  };

  const schema = yup.object({
    question: yup.string().required("Це обов`язкове поле").label("Питання"),
    answer: yup.string().required("Це обов`язкове поле").label("Відповідь")
  });

  function onSubmit(values: typeof schema.__outputType) {
    console.log({ values });
  }

  function onCreate() {
    isCreatingDialogVisible.value = true;
  }

  function onEdit(handbook: Handbook) {
    draft.value = handbook.answer;
    selectedEditingId.value = handbook.id;
  }

  function onCancelEdit(handbook: Handbook) {
    handbook.answer = draft.value;
    draft.value = "";
    selectedEditingId.value = null;
  }

  async function onUpdateHandbook(handbook: Handbook) {
    if (handbook.answer) {
      await projectStore.updateHandbook(handbook.id, handbook);
      selectedEditingId.value = null;
    }
  }

  async function onDeleteHandbook(id: number) {
    $q.dialog({
      title: "Видалити довідник",
      message: "Ви спраді хочете видалити довідник?",
      persistent: true,
      ok: "Так",
      cancel: {
        label: "Ні",
        color: "red",
        flat: true
      }
    })
      .onOk(async () => {
        await projectStore.deleteHandbook(id);
        selectedEditingId.value = null;
        return;
      })
      .onDismiss(() => {
        return;
      });
  }
</script>
<template>
  <div class="container">
    <q-dialog v-model="isCreatingDialogVisible">
      <q-card style="width: 400px">
        <Form
          :initial-values="initialValues"
          :validation-schema="schema"
          @submit="onSubmit"
        >
          <q-card-section class="q-py-sm">
            <h6 class="q-my-none">Створити відповідь</h6>
          </q-card-section>
          <q-card-section>
            <Field name="answer" v-slot="{ errorMessage, value, field }">
              <q-input-with-validation
                placeholder="Питання"
                v-bind="field"
                :model-value="value"
                :error-message="errorMessage"
              />
            </Field>
            <Field name="question" v-slot="{ errorMessage, value, field }">
              <q-input-with-validation
                placeholder="Відповідь"
                v-bind="field"
                :model-value="value"
                :error-message="errorMessage"
                type="textarea"
              />
            </Field>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Закрити" color="negative" v-close-popup />
            <q-btn flat label="Створити" type="submit" color="primary" />
          </q-card-actions>
        </Form>
      </q-card>
    </q-dialog>
    <div class="container__inner">
      <div class="header">
        <q-btn color="primary" @click="onCreate">Створити</q-btn>
      </div>
      <Loading :showing="isLoading" />
      <h5 class="q-my-sm">Довідник</h5>
      <div class="header">
        <q-input
          style="width: 100%"
          v-model="search"
          placeholder="Пошук..."
          clearable
          @clear="search = ''"
        >
          <template v-slot:prepend> <q-icon name="search" /> </template
        ></q-input>
      </div>
      <div class="body q-mt-lg">
        <q-scroll-area
          style="height: 400px"
          :thumb-style="{ height: '5px', width: '2px' }"
        >
          <template v-if="filtered.length">
            <q-expansion-item
              icon="question_mark"
              :default-opened="true"
              :label="handbook.question"
              v-for="handbook in filtered"
              :key="handbook.id"
            >
              <q-card>
                <q-card-section horizontal>
                  <q-input
                    v-model="handbook.answer"
                    style="width: 100%"
                    type="textarea"
                    class="q-px-md q-mt-md"
                    v-if="selectedEditingId === handbook.id"
                    :rules="[val => !!val || 'Це обовязкове поле']"
                  />
                  <p style="width: 100%" class="q-px-md q-pt-md" v-else>
                    {{ handbook.answer }}
                  </p>
                  <q-card-actions vertical top class="justify-start q-px-md">
                    <template v-if="selectedEditingId === handbook.id">
                      <q-btn
                        flat
                        round
                        color="positive"
                        icon="check"
                        @click="onUpdateHandbook(handbook)"
                      />
                      <q-btn
                        flat
                        round
                        color="red"
                        icon="close"
                        @click="onCancelEdit(handbook)"
                      />
                    </template>
                    <template v-else>
                      <q-btn
                        flat
                        round
                        color="grey"
                        icon="edit"
                        @click="onEdit(handbook)"
                      />
                      <q-btn
                        flat
                        round
                        color="red"
                        icon="delete"
                        @click="onDeleteHandbook(handbook.id)"
                      />
                    </template>
                  </q-card-actions>
                </q-card-section>
              </q-card>
              <q-separator class="q-mt-md" /> </q-expansion-item
          ></template>
          <p v-else class="q-mt-lg text-h6 text-center text-grey">
            Нічого не знайдено...
          </p>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .container {
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__inner {
      width: 500px;
      padding: 15px;
      background: #fff;
      border-radius: 12px;
      position: relative;

      .header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
</style>
