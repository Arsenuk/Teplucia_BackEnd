
<template>
  <v-app-bar color="grey-lighten-4" height="50px" rounded="0" flat>
    <!-- Кнопка меню -->
    <v-menu
      activator="parent"
      location="bottom-start"
      transition="scale-transition"
    >
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          @click="selectItem(item)"
        >
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Логотип і назва -->
    
      <v-img
        :src="logo"
        alt="Logo"
        contain
        max-width="60"
        class="mr-3"
      ></v-img>
      <span class="text-h6 font-weight-bold">Теплиця</span>
   

    <v-spacer></v-spacer>

    <!-- Кнопка облікового запису -->
    <v-btn icon @click="openAccount">
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import logo from '@/assets/images/logo.png';

const menuItems = ['Головна', 'Моніторинг', 'Налаштування', 'Контакти'];

function selectItem(item) {
  console.log('Вибрано пункт меню:', item);
}

function openAccount() {
  console.log('Відкрити обліковий запис');
}
</script>

<style scoped>
.v-app-bar {
  padding-left: 12px;
  padding-right: 12px;
}
.v-img{
    margin: 10px;
}

</style>
