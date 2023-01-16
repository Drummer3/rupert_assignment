<script setup lang="ts">
import { onMounted, ref } from "vue";
import TableView from "./components/TableView.vue";
import type { MockDataTypes } from "@/types/api";

import { RadioGroup, RadioGroupOption } from "@headlessui/vue";

const plan = ref("time");
let data = ref<MockDataTypes[]>();
const search = ref("");

function handleDelete(deletedRow: MockDataTypes) {
  // IDEALLY I WOULD HAVE SOME KIND OF ID FOR EACH ROW AND I WOULD USE IT FOR THE DELETION
  data.value = data.value?.filter(
    (row) => JSON.stringify(row) != JSON.stringify(deletedRow)
  );
}

onMounted(async () => {
  data.value = await (await fetch("/data.json")).json();
});
</script>

<template>
  <main class="max-w-7xl mx-auto mt-2 mb-8 bg-violet-100 p-4">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-700">
        Summaries and notifications
      </h1>
      <input
        v-model="search"
        type="text"
        placeholder="Search title, owner name, #slack channel"
        class="py-1 px-2 rounded-md focus:outline focus:outline-1 focus:outline-violet-900"
      />
    </div>
    <RadioGroup v-model="plan" class="tabs">
      <RadioGroupOption v-slot="{ checked }" value="data">
        <p :class="'tab' + (checked ? ' active' : '')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
            />
          </svg>

          Data Triggered ({{
            data?.filter((record) => record.trigger === "data").length
          }})
        </p>
      </RadioGroupOption>
      <RadioGroupOption v-slot="{ checked }" value="time">
        <p :class="'tab' + (checked ? ' active' : '')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Time Triggered ({{
            data?.filter((record) => record.trigger === "time").length
          }})
        </p>
      </RadioGroupOption>
      <RadioGroupOption v-slot="{ checked }" value="one-time">
        <p :class="'tab' + (checked ? ' active' : '')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>

          Sent Once ({{
            data?.filter((record) => record.trigger === "one-time").length
          }})
        </p>
      </RadioGroupOption>
    </RadioGroup>
    <TableView
      :data="
        data?.filter(
          (record) =>
            record.trigger === plan &&
            (record.title
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) ||
              record.creator.name
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase()) ||
              record.recipients.some((recipient) =>
                recipient
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase())
              ))
        )
      "
      @on-row-delete="handleDelete"
    />
  </main>
</template>

<style lang="scss">
.tabs {
  @apply flex my-4;

  .tab {
    @apply px-4 py-2 text-gray-500 cursor-pointer flex gap-2 items-center;

    & > svg {
      @apply stroke-1;
    }
  }
  .active {
    @apply font-bold border-b-2 border-gray-500;

    & > svg {
      @apply stroke-2;
    }
  }
}
</style>
