<script setup lang="ts">
  import { useQuasar } from "quasar";
  import { computed, onMounted, ref } from "vue";
  import type { Handbook } from "@/types";
  import { useAgentStore } from "@/stores/agent";
  import { storeToRefs } from "pinia";
  import Loading from "@/components/agent/Loading.vue";

  const $q = useQuasar();

  const agentStore = useAgentStore();

  const isLoading = ref(false);

  onMounted(async () => {
    isLoading.value = true;
    await agentStore.getHandbooks();

    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  });

  const { handbooks } = storeToRefs(agentStore);

  const search = ref("");

  async function onCopy(handbook: Handbook) {
    await navigator.clipboard.writeText(handbook.answer);
    $q.notify({
      message: "Скопійовано!",
      icon: "content_copy"
    });
  }

  const filtered = computed(() => {
    return handbooks.value.filter(handbook =>
      handbook.question
        .toLowerCase()
        .includes(search.value.toLowerCase().trim())
    );
  });
</script>
<template>
  <div class="container">
    <div class="container__inner">
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
                  <p class="q-px-md q-mt-md" style="width: 100%">
                    {{ handbook.answer }}
                  </p>
                  <q-card-actions vertical class="justify-around q-px-md">
                    <q-btn
                      flat
                      round
                      color="grey"
                      icon="content_copy"
                      @click="onCopy(handbook)"
                    />
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
        justify-content: space-between;
        align-items: center;
      }
    }
  }
</style>
