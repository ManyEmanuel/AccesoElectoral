<template>
  <q-page padding>
    <div v-if="opciones.length > 0" class="row items-start">
      <div
        v-for="items in opciones"
        :key="items.id"
        class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-lg"
      >
        <q-card
          class="my-card q-hoverable"
          @mouseover="items.modelo = true"
          @mouseout="items.modelo = false"
          @click="goToGoogle"
          style="width: 100px"
        >
          <q-img
            src="https://cdn.quasar.dev/img/parallax2.jpg"
            basic
            style="width: 100px; height: 200px"
          >
            <div class="absolute-bottom text-subtitle2 text-center">
              Vacante
            </div>
          </q-img>
          <q-slide-transition>
            <div v-show="items.modelo">
              <q-separator />
              <q-card-section class="text-subitle2">
                {{ items.opcion }}
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>
    <div v-else class="text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 10vh">Bienvenido</div>

        <div class="text-h2" style="opacity: 0.4">
          No hay vacantes disponibles
        </div>
        <div>
          <img
            alt="Quasar logo"
            src="~assets/IEEN300.png"
            style="width: 200px; height: 132px"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, ref } from "vue";
const opciones = ref([]);
/*const opciones = ref([
  { id: 1, modelo: false, opcion: "Opcion 1" },
  { id: 2, modelo: false, opcion: "Opcion 2" },
  { id: 3, modelo: false, opcion: "Opcion 3" },
]);*/
const goToGoogle = () => {
  window.location.href = "https://www.google.com";
};
</script>
<style></style>
