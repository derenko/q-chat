<script setup lang="ts">
  import { useUserStore } from "@/stores/user";
  import { ref } from "vue";
  import AppLogo from "@/components/shared/AppLogo.vue";
  import QInputWithValidation from "@/components/shared/QInputWithValidation.vue";
  import { Form, Field } from "vee-validate";
  import * as yup from "yup";

  const userStore = useUserStore();

  const isPasswordVisible = ref(false);
  const isLoading = ref(false);

  const initialValues = {
    email: "",
    password: "",
    name: "",
    website: ""
  };

  const onSubmit = async (values: {
    email: string;
    password: string;
    name: string;
    website: string;
  }) => {
    isLoading.value = true;
    await userStore.signUp(values);
    isLoading.value = false;
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
      .label("Пароль"),
    name: yup.string().required("Обов`язкове поле"),
    website: yup
      .string()
      .required("Обов`язкове поле")
      .url("Невірний формат веб-сайту")
  });
</script>
<template>
  <div class="form">
    <h4 class="q-my-sm text-center text-primary">
      <q-icon name="how_to_reg" />
      Реєстрація
    </h4>

    <Form
      :validation-schema="schema"
      :initial-values="initialValues"
      autocomplete="off"
      class="q-mt-md"
      @submit="onSubmit"
      v-slot="{ meta }"
    >
      <Field name="email" v-slot="{ errorMessage, value, field }">
        <q-input-with-validation
          :model-value="value"
          :error-message="errorMessage"
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
          v-bind="field"
          :error-message="errorMessage"
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
      <Field name="name" v-slot="{ errorMessage, value, field }">
        <q-input-with-validation
          :model-value="value"
          v-bind="field"
          :error-message="errorMessage"
          placeholder="Назва проекту"
          autocomplete="off"
        >
          <template v-slot:prepend>
            <q-icon name="badge"></q-icon>
          </template>
        </q-input-with-validation>
      </Field>

      <Field name="website" v-slot="{ errorMessage, value, field }">
        <q-input-with-validation
          :model-value="value"
          :error-message="errorMessage"
          v-bind="field"
          placeholder="URL веб-сайту"
          autocomplete="off"
          
        >
          <template v-slot:prepend>
            <q-icon name="link"></q-icon>
          </template>
        </q-input-with-validation>
      </Field>

      <q-btn
        color="primary"
        class="button--submit"
        type="submit"
        :loading="isLoading"
        :disable="meta.touched && !meta.valid"
        >Зареєструватись</q-btn
      >

      <h6 class="text-center q-my-md text-grey">АБО</h6>

      <q-btn color="grey" to="/login" flat class="button--registration"
        >Увійти</q-btn
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
    margin: 150px auto 0;
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
