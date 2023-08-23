import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
const router = useRouter();

export const isAuthenticatedGuard = async (to, from, next) => {
  const token = localStorage.getItem("tokenE");
  console.log("Esto es token", token);
  if (token != null && token != "") {
    const resp = await api.get("/Accesos/ValidarToken?token=" + token);
    let { success } = resp.data;
    if (success == true) {
      let acceso = await checkToken();
      if (acceso == true) {
        window.location =
          "http://sistema.ieenayarit.org:9372/#/?tokenE=" +
          localStorage.getItem("tokenE") +
          "&userNameL=" +
          localStorage.getItem("userNameL");
        next({ name: "Principal" });
      } else {
        await removeToken();
      }
    } else {
      await removeToken();
    }
  } else {
    next();
  }
};

export const checkToken = async () => {
  const valores = window.location.search;
  const urlParams = new URLSearchParams(valores);
  const regreso = urlParams.get("return");
  if (regreso != null) {
    if (regreso == "false") {
      return false;
    } else if (regreso == "true") {
      return true;
    }
  } else {
    return true;
  }
};

export const removeToken = async () => {
  localStorage.removeItem("tokenE");
  localStorage.removeItem("userNameL");
};

export const useAccesoStore = defineStore("acceso", {
  state: () => ({
    acceso: {
      usuario: null,
      password: null,
    },
  }),
  actions: {
    async doLogin(acceso) {
      try {
        let resp = await api.post("/Accesos", acceso);
        if (resp.status == 200) {
          let { token, userName } = resp.data;
          if (token != undefined && token != "") {
            await this.setToken(token, userName);
            return { success: true, data: "Bienvenido al universo IEEN" };
          } else {
            return {
              success: false,
              data: "Error al iniciar sesión, intente de nuevo",
            };
          }
        } else {
          return {
            success: false,
            data: "Usuario/Contraseña incorrectos",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async setToken(token, userName) {
      localStorage.setItem("tokenE", token);
      localStorage.setItem("userNameL", userName);
    },

    async removeToken() {
      localStorage.removeItem("tokenE");
      localStorage.removeItem("userNameL");
    },
  },
});
