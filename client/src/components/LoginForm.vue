<script setup lang="ts">
  import type { PropType } from "vue";
  import type { LoginForm } from "@/types";
  import QInputWithValidation from "./QInputWIthValidation.vue";
  import { Form, Field } from "vee-validate";
  import * as yup from "yup";

  interface Emits {
    (e: "submit", values: Values): void;
  }

  const props = defineProps({
    initialValues: {
      type: Object as PropType<LoginForm>,
      default: () => ({
        name: "",
        email: "",
        phone: ""
      })
    },
    isSubmited: {
      type: Boolean,
      default: false
    }
  });

  const schema = yup.object({
    email: yup
      .string()
      .required("Обов`язкове поле")
      .email("Невірний формат E-мейлу")
      .label("E-мейл"),
    name: yup.string().required("Обов`язкове поле"),
    phone: yup.string().optional()
  });

  type Values = typeof schema.__outputType;

  const emit = defineEmits<Emits>();

  const onSubmit = (values: Values) => {
    emit("submit", values);
  };
</script>
<template>
  <Form
    :validation-schema="schema"
    :initial-values="props.initialValues"
    @submit="onSubmit"
    class="form"
  >
    <Field name="name" v-slot="{ errorMessage, value, field }">
      <q-input-with-validation
        :model-value="value"
        v-bind="field"
        :error-message="errorMessage"
        placeholder="Ваше ім'я"
        :readonly="isSubmited"
      />
    </Field>

    <Field name="email" v-slot="{ errorMessage, value, field }">
      <q-input-with-validation
        :model-value="value"
        v-bind="field"
        :error-message="errorMessage"
        placeholder="Ваш E-mail"
        :readonly="isSubmited"
      />
    </Field>

    <Field name="phone" v-slot="{ errorMessage, value, field }">
      <q-input-with-validation
        :model-value="value"
        v-bind="field"
        :error-message="errorMessage"
        placeholder="Ваш телефон"
        :readonly="isSubmited"
        mask="+38 (###) ## ## ###"
      />
    </Field>

    <q-btn
      v-if="props.isSubmited"
      class="submit no-shadow disabled"
      color="blue-grey-9"
      disabled
    >
      🎉 Дякуємо!
    </q-btn>
    <q-btn
      v-else
      label="Відправити"
      class="submit no-shadow"
      type="submit"
      color="blue-grey-9"
      :ripple="false"
    />
  </Form>
</template>
<style lang="scss" scoped>
  .form {
    max-width: 285px;
    margin: 15px auto;
    background: #fefefe;
    border-radius: 12px;
    box-shadow: 0 3px 10px 0 rgb(0 0 0 / 8%), 0 0 1px 0 rgb(0 0 0 / 22%),
      inset 0 2px 0 0 #445669;
    padding: 10px 15px 20px;

    .submit {
      width: 100%;
      margin: 20px 0 0;
      border-radius: 5px;
    }

    .submit.disabled {
      cursor: default !important;
    }
  }
</style>
