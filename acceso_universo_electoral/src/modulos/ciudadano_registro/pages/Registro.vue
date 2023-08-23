<template>
  <q-layout>
    <img src="~assets/FondoNuevo.png" class="wave" />
    <div class="row" style="height: 98vh">
      <div class="col-0 col-md-6 flex justify-center content-center q-pa-xl">
        <img
          src="~assets/LogoUniverso.png"
          class="responsive"
          alt="Logo institucional"
          style="width: 70%"
        />
      </div>
      <div
        v-bind:class="{
          'justify-center': $q.screen.md || $q.screen.sm || $q.screen.xs,
        }"
        class="col-12 col-md-6 flex content-center text-center items-center"
      >
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '50%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="~assets/perfilieen.jpg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="q-pt-lg">
              <div class="col text-h6 ellipsis flex justify-center">
                <h2
                  class="text-h6 text-uppercase q-my-none text-weight-regular"
                >
                  Registro<br />
                </h2>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form ref="ResetRegistro" class="q-gutter-md" @submit="onSubmit">
              <div class="row">
                <div class="col-12">
                  <q-input
                    v-model="usuario.nombres"
                    label="Nombre(s)"
                    color="accent"
                  >
                  </q-input>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="usuario.apellido_Paterno"
                    label="Apellido paterno"
                    color="accent"
                  >
                  </q-input>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="usuario.apellido_Materno"
                    label="Apellido materno"
                    color="accent"
                  >
                  </q-input>
                </div>
                <div class="col-12">
                  <q-file
                    color="purple-12"
                    v-model="usuario.foto"
                    label="Fotografía"
                    hint="Si desea, puede agregar su fotografía"
                    multiple
                    accept=".jpg, .png, image/*"
                  >
                    <template v-slot:prepend>
                      <q-icon name="photo_camera" />
                    </template>
                  </q-file>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="usuario.phoneNumber"
                    label="Teléfono"
                    color="accent"
                    mask="##########"
                  >
                  </q-input>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="usuario.email"
                    label="Correo electrónico"
                    color="accent"
                    :rules="[
                      (val) => !!val || 'El correo electrónico es requerido',
                    ]"
                  >
                  </q-input>
                </div>
                <div class="col-12">
                  <q-input
                    bottom-slots
                    v-model="correoVerificacion"
                    label="Confirmar correo electrónico"
                    color="accent"
                    :rules="[
                      (val) =>
                        !!val || 'Por favor verificar correo electrónico',
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="correoVerificacion != ''"
                        :name="verificacionEstatus == false ? 'close' : 'check'"
                        :class="
                          verificacionEstatus == false
                            ? 'cursor-pointer text-red'
                            : 'cursor-pointer text-green'
                        "
                      />
                    </template>

                    <template v-slot:hint>
                      <div v-if="correoVerificacion != ''">
                        {{
                          verificacionEstatus == false
                            ? "Los correos no coinciden"
                            : "Los correos coinciden"
                        }}
                      </div>
                    </template>
                  </q-input>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="usuario.clave_Elector"
                    label="Clave de elector"
                    color="accent"
                    counter
                    maxlength="18"
                    mask="XXXXXXXXXXXXXXXXXX"
                  ></q-input>
                </div>
                <div class="col-12">
                  <q-select
                    v-model="usuario.sexo"
                    :options="genero"
                    label="Género"
                  >
                  </q-select>
                </div>
              </div>
              <div class="q-gutter-md q-pa-xs">
                <q-btn
                  class="col-6"
                  color="accent"
                  label="Guardar"
                  type="submit"
                ></q-btn>
                <q-btn
                  class="col-6"
                  color="accent"
                  label="Cancelar"
                  @click="actualizarModal()"
                ></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        <q-page-container>
          <q-page padding>
            <q-page-sticky position="bottom-right" :offset="[20, 20]">
              <q-btn
                round
                :icon="$q.dark.mode == false ? 'mode_night' : 'sunny'"
                :color="$q.dark.mode == false ? 'black' : 'white'"
                :text-color="$q.dark.mode == false ? 'white' : 'black'"
                @click="
                  $q.dark.mode == false ? $q.dark.set(true) : $q.dark.set(false)
                "
              />
            </q-page-sticky>
          </q-page>
        </q-page-container>
      </div>
    </div>
  </q-layout>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useQuasar, QSpinnerBall } from "quasar";
import { useRegistroStore } from "../../../store/registro_store";
import Reporte from "../../../helpers/vale_usuario";
import ReporteCME03 from "../../../helpers/CME-F03";
//import ReporteHotel from "../../../helpers/ListadoHotel";
const registroStore = useRegistroStore();
const router = useRouter();
const $q = useQuasar();
const { usuario } = storeToRefs(registroStore);
const genero = ref(["Masculino", "Femenino", "No binario"]);
const correoVerificacion = ref("");
const verificacionEstatus = ref(false);
const ResetRegistro = ref();

watch(correoVerificacion, (val) => {
  if (val != null) {
    if (val == usuario.value.email) {
      verificacionEstatus.value = true;
    } else {
      verificacionEstatus.value = false;
    }
  }
});

const actualizarModal = () => {
  registroStore.initUsuario();
  correoVerificacion.value = "";
  verificacionEstatus.value = false;
  $q.loading.show({
    spinner: QSpinnerBall,
    spinnerColor: "white",
    spinnerSize: 140,
    message: "Redireccionando al login",
    messageColor: "white",
  });
  router.push({ name: "login" });
  $q.loading.hide();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show({
    spinner: QSpinnerBall,
    spinnerColor: "white",
    spinnerSize: 140,
    message: "Generando usuario",
    messageColor: "white",
  });
  if (verificacionEstatus.value == true) {
    if (usuario.value.nombres != null) {
      usuario.value.nombres.trim();
    }
    if (usuario.value.apellido_Paterno != null) {
      usuario.value.apellido_Paterno.trim();
    }
    if (usuario.value.apellido_Materno != null) {
      usuario.value.apellido_Materno.trim();
    }
    let bodyFormData = new FormData();
    bodyFormData.append("foto", usuario.value.foto);
    bodyFormData.append("nombres", usuario.value.nombres);
    bodyFormData.append("apellido_Paterno", usuario.value.apellido_Paterno);
    bodyFormData.append("apellido_Materno", usuario.value.apellido_Materno);
    bodyFormData.append("clave_Elector", usuario.value.clave_Elector);
    bodyFormData.append("sexo", usuario.value.sexo);
    bodyFormData.append("userName", usuario.value.email);
    bodyFormData.append("email", usuario.value.email);
    bodyFormData.append("phoneNumber", usuario.value.phoneNumber);
    resp = await registroStore.createUsuario(bodyFormData);
    if (resp.data.length == 1) {
      resp.data = "Correo electronico ya registrado a otro usuario";
    }
    if (resp.success) {
      await generarVale(resp.password, usuario.value.email);
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      actualizarModal();
      ResetRegistro.value.resetValidation();
    } else {
      $q.notify({
        type: "negative",
        message: resp.data,
      });
      //loading.value = false;
    }
  } else {
    $q.notify({
      type: "negative",
      message: "Los correos no coinciden",
    });
  }

  $q.loading.hide();
};

const generarVale = async (pass, user) => {
  Reporte(pass, user);
};
</script>

<style scoped>
.wave {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
</style>
