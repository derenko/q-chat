<script setup lang="ts">
  import { useUserStore } from "@/stores/user";
  import { ref } from "vue";
  import AppLogo from "@/components/shared/AppLogo.vue";
  import * as yup from "yup";
  import { Field, Form } from "vee-validate";
  import QInputWithValidation from "@/components/shared/QInputWithValidation.vue";

  const userStore = useUserStore();
  const isPasswordVisible = ref(false);
  const isLoading = ref(false);

  const initialValues = {
    email: "",
    password: ""
  };

  const schema = yup.object({
    email: yup
      .string()
      .required("Обов`язкове поле")
      .email("Невірний формат E-мейлу")
      .label("E-мейл"),
    password: yup
      .string()
      .required("Обов`язкове поле")
      .min(6, "Мінімум ${min} символів")
      .label("Пароль")
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    isLoading.value = true;
    await userStore.signIn(values);
    isLoading.value = false;
  };
</script>
<template>
  <div class="form">
    <h4 class="q-my-sm text-center text-primary">
      <q-icon name="login" />
      Вхід
    </h4>

    <Form
      :validation-schema="schema"
      :initial-values="initialValues"
      @submit="onSubmit"
      v-slot="{ meta }"
    >
      <Field name="email" v-slot="{ errorMessage, value, field }">
        <q-input-with-validation
          :error-message="errorMessage"
          :model-value="value"
          v-bind="field"
          placeholder="E-mail"
          autocomplete="off"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input-with-validation>
      </Field>
      <Field name="password" v-slot="{ errorMessage, value, field }">
        <q-input-with-validation
          :model-value="value"
          :error-message="errorMessage"
          v-bind="field"
          :type="isPasswordVisible ? 'text' : 'password'"
          placeholder="Пароль"
          autocomplete="off"
        >
          <template v-slot:prepend>
            <q-icon name="lock"></q-icon>
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPasswordVisible = !isPasswordVisible"
            />
          </template>
        </q-input-with-validation>
      </Field>
      <q-btn
        color="primary"
        class="button--submit"
        type="submit"
        :loading="isLoading"
        :disable="meta.touched && !meta.valid"
        >Увійти</q-btn
      >

      <h6 class="text-center q-my-md text-grey">АБО</h6>

      <q-btn color="grey" to="/registration" flat class="button--registration"
        >Зареєструватись</q-btn
      >
    </Form>

    <div class="logo">
      <AppLogo color="#1976D2" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .form {
    background: #fff;
    max-width: 450px;
    margin: 250px auto 0;
    padding: 15px 15px 25px;
    border-radius: 12px;

    .logo {
      display: flex;
      justify-content: center;
    }

    .button--submit {
      margin-top: 25px;
      width: 100%;
    }

    .button--registration {
      width: 100%;
    }
  }
</style>
