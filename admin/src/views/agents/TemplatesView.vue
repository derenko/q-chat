<script setup lang="ts">
  import { useAgentStore } from "@/stores/agent";
  import { storeToRefs } from "pinia";
  import { useQuasar } from "quasar";
  import { computed, onMounted, ref } from "vue";
  import Loading from "@/components/agent/Loading.vue";
  import * as yup from "yup";
  import { Form, Field } from "vee-validate";
  import QInputWithValidation from "@/components/shared/QInputWithValidation.vue";

  const agentStore = useAgentStore();

  onMounted(async () => {
    isLoading.value = true;
    await agentStore.getTemplates();

    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  });

  const { templates } = storeToRefs(agentStore);

  const search = ref("");
  const isCreatingDialogVisible = ref(false);
  const editingTemplateId = ref<null | number>(null);
  const draft = ref("");
  const isLoading = ref(true);

  const $q = useQuasar();

  const filtered = computed(() => {
    return templates.value.filter(
      template => template.text.indexOf(search.value) !== -1
    );
  });

  const schema = yup.object({
    text: yup
      .string()
      .required("Це поле обов`язкове")
      .max(100, "Максимальна довжина ${max} символів")
  });

  type Values = typeof schema.__outputType;

  async function onCreateTemplate(values: Values) {
    await agentStore.createTemplate(values.text);
    isCreatingDialogVisible.value = false;
  }

  const initialValues = {
    name: ""
  };

  function onSelectTemplate(templateId: number) {
    const template = templates.value.find(
      template => template.id === templateId
    );

    if (template) {
      draft.value = template.text;
      editingTemplateId.value = templateId;
    }
  }

  function onCancelEditing(templateId: number) {
    const template = templates.value.find(
      template => template.id === templateId
    );

    if (template) {
      templates.value = templates.value.map(t => {
        if (t.id === templateId) {
          return { ...template, text: draft.value };
        }

        return t;
      });

      editingTemplateId.value = null;
      draft.value = "";
    }
  }

  async function onEditTemplate(templateId: number) {
    const template = templates.value.find(t => t.id === templateId);

    if (template) {
      const text = template.text;
      draft.value = text;

      await agentStore.updateTemplate({ id: templateId, text });
      editingTemplateId.value = null;
    }
  }

  function onDeleteTemplate(templateId: number) {
    $q.dialog({
      title: "Видалити шаблон",
      message: "Ви спраді хочете видалити шаблон?",
      persistent: true,
      ok: "Так",
      cancel: {
        label: "Ні",
        color: "red",
        flat: true
      }
    })
      .onOk(async () => {
        await agentStore.deleteTemplate(templateId);
        editingTemplateId.value = null;
        return;
      })
      .onDismiss(() => {
        return;
      });
  }
</script>
<template>
  <div class="templates">
    <q-dialog v-model="isCreatingDialogVisible">
      <q-card style="width: 400px">
        <Form
          :validation-schema="schema"
          :initial-values="initialValues"
          @submit="onCreateTemplate"
        >
          <q-card-section class="q-py-sm">
            <h6 class="q-my-none">Створити шаблон</h6>
          </q-card-section>
          <q-card-section>
            <Field name="text" v-slot="{ field, value, errorMessage }">
              <q-input-with-validation
                :model-value="value"
                placeholder="Текст"
                counter
                v-bind="field"
                :error-message="errorMessage"
                maxlength="100"
              >
                <template v-slot:prepend>
                  <q-icon name="chat_bubble" />
                </template>
              </q-input-with-validation>
            </Field>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Закрити" color="negative" v-close-popup />
            <q-btn flat label="Створити" type="submit" color="primary" />
          </q-card-actions>
        </Form>
      </q-card>
    </q-dialog>
    <div class="templates__inner">
      <Loading :showing="isLoading" />
      <h5 class="q-my-sm">Шаблони</h5>

      <div class="header">
        <q-input
          style="width: 300px"
          v-model="search"
          placeholder="Пошук..."
          clearable
          @clear="search = ''"
        >
          <template v-slot:prepend> <q-icon name="search" /> </template
        ></q-input>
        <q-btn
          icon="add"
          color="primary"
          @click="isCreatingDialogVisible = true"
        />
      </div>

      <div class="body q-mt-lg">
        <q-scroll-area
          style="height: 400px"
          :thumb-style="{ height: '5px', width: '2px' }"
        >
          <q-list v-if="filtered.length">
            <q-item v-for="template in filtered" :key="template.id">
              <q-item-section clickable>
                <q-input
                  v-model="template.text"
                  :counter="true"
                  maxlength="100"
                  :readonly="editingTemplateId !== template.id"
                  :rules="[val => !!val || 'Це обовязкове поле']"
                >
                  <template v-slot:prepend>
                    <q-icon name="chat_bubble" />
                  </template>
                  <template v-slot:append>
                    <div v-if="editingTemplateId === template.id">
                      <q-btn
                        flat
                        icon="close"
                        color="red"
                        @click="onCancelEditing(template.id)"
                      />
                      <q-btn
                        flat
                        icon="check"
                        color="positive"
                        @click.stop="onEditTemplate(template.id)"
                      />
                    </div>
                    <template v-else>
                      <q-btn
                        icon="edit"
                        color="grey"
                        flat
                        @click.stop="onSelectTemplate(template.id)"
                      />
                      <q-btn
                        flat
                        icon="delete"
                        color="red"
                        @click="onDeleteTemplate(template.id)"
                      />
                    </template>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
          <p v-else class="q-mt-lg text-h6 text-center text-grey">
            Нічого не знайдено...
          </p>
        </q-scroll-area>
      </div>
      <div class="footer q-mt-lg">
        <p class="text-grey text-center text-body2">
          <q-icon name="info_outlined" color="grey" size="18px" />
          <span
            >Тут ви можете додати швидкі шаблони для ваших повідомлень.</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .templates {
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
      margin: 0 auto;
      position: relative;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .pagination {
        display: flex;
        justify-content: center;
        padding: 0 0 20px;
      }
    }
  }
</style>
