<script setup lang="ts">
  import { useProjectStore } from "@/stores/project";
  import { useUserStore } from "@/stores/user";
  import moment from "moment";
  import { storeToRefs } from "pinia";
  import { computed, onMounted, reactive, ref } from "vue";
  import Loading from "@/components/agent/Loading.vue";
  import { Form, Field } from "vee-validate";
  import * as yup from "yup";
  import QInputWithValidation from "@/components/shared/QInputWithValidation.vue";

  const userStore = useUserStore();
  const projectStore = useProjectStore();
  const isLoading = ref(false);

  onMounted(async () => {
    isLoading.value = true;

    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  });

  const { user, project } = storeToRefs(userStore);

  const isEdit = ref(false);

  const form = reactive({
    name: project.value?.name,
    email: user.value?.email,
    website: project.value?.website
  });

  const createdAt = computed(() =>
    moment(project.value?.createdAt).format("DD.MM.YYYY")
  );

  const schema = yup.object({
    name: yup.string().required("Це поле обов'язкове"),
    website: yup
      .string()
      .required("Це поле обов'язкове")
      .url("Введіть коректний URL")
  });

  type Values = typeof schema.__outputType;

  async function onSubmit({ name, website }: Values) {
    await projectStore.updateProject(userStore.project?.id, { name, website });
    isEdit.value = false;
  }
</script>
<template>
  <div class="container">
    <div class="container__inner shadow-2">
      <Form
        :validation-schema="schema"
        :initial-values="form"
        @submit="onSubmit"
        v-slot="{ meta }"
      >
        <Loading :showing="isLoading" />

        <h5 class="q-my-sm">Профіль Компанії</h5>

        <div class="settings">
          <q-btn
            :icon="isEdit ? 'close' : 'edit'"
            rounded
            flat
            @click="isEdit = !isEdit"
            color="grey"
            :disable="meta.touched && !meta.valid"
          />
        </div>
        <Field name="name" v-slot="{ errorMessage, value, field }">
          <q-input-with-validation
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            label="Ім'я"
            :readonly="!isEdit"
          />
        </Field>
        <Field name="website" v-slot="{ errorMessage, value, field }">
          <q-input-with-validation
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            label="URL"
            :readonly="!isEdit"
          />
        </Field>
        <q-input v-model="form.email" label="E-mail" readonly />
        <q-input v-model="createdAt" label="Дата створення" readonly />

        <div class="buttons">
          <q-btn v-if="isEdit" color="primary" type="submit">Зберегти</q-btn>
        </div>
      </Form>
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
    }

    .avatar {
      display: block;
      width: 100px;
      height: 100px;
      margin: 0 auto;
    }
  }

  .settings {
    display: flex;
    justify-content: flex-end;
  }
  .statistic {
    display: flex;
    justify-content: center;

    &__item {
      margin: 0 15px;
      text-align: center;
    }
  }

  .buttons {
    margin: 20px 0 0;
    display: flex;
    justify-content: flex-end;
  }
</style>
