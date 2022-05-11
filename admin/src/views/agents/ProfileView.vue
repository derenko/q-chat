<script setup lang="ts">
  import { useAgentStore } from "@/stores/agent";
  import { useUserStore } from "@/stores/user";
  import moment from "moment";
  import { storeToRefs } from "pinia";
  import { computed, onMounted, reactive, ref } from "vue";
  import Loading from "@/components/agent/Loading.vue";
  import { Form, Field } from "vee-validate";
  import * as yup from "yup";
  import QInputWithValidation from "@/components/shared/QInputWithValidation.vue";

  const userStore = useUserStore();
  const agentStore = useAgentStore();
  const isLoading = ref(false);

  const profile = computed(() => ({
    chatsCount: agentStore.profile?.chatsCount ?? 0,
    rating: agentStore.profile?.rating?.toFixed(1) ?? 5.0
  }));

  onMounted(async () => {
    isLoading.value = true;
    await agentStore.getProfile();
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  });

  const { user, agent } = storeToRefs(userStore);

  const isEdit = ref(false);

  const form = reactive({
    name: agent.value?.name,
    email: user.value?.email,
    avatar: agent.value?.avatar
  });

  const createdAt = computed(() =>
    moment(agent.value?.createdAt).format("DD.MM.YYYY")
  );

  const schema = yup.object({
    name: yup.string().required("Це обов'язкове поле")
  });

  type Values = typeof schema.__outputType;

  async function onSubmit(values: Values) {
    await agentStore.updateProfile(values);
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

        <h5 class="q-my-sm">Профіль</h5>

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
        <img :src="form.avatar" class="avatar" />
        <div class="statistic">
          <div class="statistic__item text-grey">
            <h6 class="q-my-sm">Чатів</h6>
            <h4 class="q-my-sm count">
              <q-icon name="chat" color="grey" />
              {{ profile.chatsCount }}
            </h4>
          </div>
          <div class="statistic__item text-grey">
            <h6 class="q-my-sm">Рейтинг</h6>
            <h4 class="q-my-sm">
              <q-icon name="star" color="grey" /> {{ profile.rating }}
            </h4>
          </div>
        </div>
        <Field name="name" v-slot="{ field, value, errorMessage }">
          <q-input-with-validation
            label="Ім'я"
            :error-message="errorMessage"
            :model-value="value"
            v-bind="field"
            :readonly="!isEdit"
          />
        </Field>
        <q-input v-model="form.email" label="E-mail" readonly />
        <q-input v-model="createdAt" label="Дата початку роботи" readonly />

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
