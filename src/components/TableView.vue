<script setup lang="ts">
import type { MockDataTypes } from "@/types/api";
import { watchEffect, ref } from "vue";

const props = defineProps<{
  data: MockDataTypes[] | undefined;
}>();

defineEmits<{
  (e: "onRowDelete", row: MockDataTypes): void;
}>();

let table = ref(props.data);

function sortBy(column: string) {
  if (column === "title" || column === "next_delivery" || column === "interval")
    table.value?.sort((a, b) => {
      if (a[column].toLocaleLowerCase() < b[column].toLocaleLowerCase()) {
        return -1;
      }
      if (a[column].toLocaleLowerCase() > b[column].toLocaleLowerCase()) {
        return 1;
      }
      return 0;
    });

  if (column === "creator")
    table.value?.sort((a, b) => {
      if (
        a[column].name.toLocaleLowerCase() < b[column].name.toLocaleLowerCase()
      ) {
        return -1;
      }
      if (
        a[column].name.toLocaleLowerCase() > b[column].name.toLocaleLowerCase()
      ) {
        return 1;
      }
      return 0;
    });

  if (column === "recipients")
    table.value?.sort((a, b) => {
      if (a[column].length < b[column].length) {
        return -1;
      }
      if (a[column].length > b[column].length) {
        return 1;
      }
      return 0;
    });
}

watchEffect(() => {
  table.value = props.data;
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <td @click="sortBy('title')">Title</td>
        <td @click="sortBy('creator')">Creator</td>
        <td @click="sortBy('recipients')">Recipients</td>
        <td @click="sortBy('interval')">Interval</td>
        <td @click="sortBy('next_delivery')">Next Delivery</td>
        <td></td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in table" :key="row.creator.id + row.next_delivery">
        <td>{{ row.title }}</td>
        <td>
          <span class="bg-blue-300 text-xs text-gray-700 p-1 text-center">
            {{
              row.creator.name.split(" ")[0][0] +
              row.creator.name.split(" ")[1][0]
            }}
          </span>
          {{ row.creator.name }}
        </td>
        <td>
          <ul>
            <li v-for="recipient in row.recipients" :key="recipient">
              #{{ recipient }}
            </li>
          </ul>
        </td>
        <td>
          <div class="bg-emerald-300 text-sm text-gray-700 p-1 text-center">
            {{ row.interval }}
          </div>
        </td>
        <td>{{ new Date(row.next_delivery).toUTCString() }}</td>
        <td>
          <button @click="$emit('onRowDelete', row)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
table {
  @apply w-full;

  tr {
    @apply border-y border-gray-400;
  }

  td {
    @apply p-2;
  }

  thead {
    @apply bg-violet-50;

    td {
      @apply cursor-pointer;
    }
  }

  tbody {
    tr:nth-child(even) {
      @apply bg-white;
    }

    tr {
      @apply hover:bg-violet-200;

      &:hover td > button {
        @apply opacity-100;
      }
    }

    td > button {
      @apply opacity-0 bg-indigo-300 p-1 rounded-md text-violet-700 hover:bg-indigo-400 hover:text-violet-900 duration-150;
    }
  }
}
</style>
