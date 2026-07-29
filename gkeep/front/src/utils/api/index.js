import axios from 'axios'
import { toast } from 'vue3-toastify'

export default {
  QUERY(options, defaultError = true, customHeaders = {}, signal = null) {
    const data = options.data

    return new Promise((resolve, reject) => {
      axios({
        url: options.url,
        method: options.method,
        headers: {
          'Accept-Language': 'ru',
          'Content-Type': 'application/json',
          ...customHeaders,
        },
        signal,
        params: options.params,
        data,
        responseType: options.responseType,
      })
        .then((response) => {
          // 100-399
          // Busness logic error
          if (response?.data?.error) {
            const error = response?.data?.error
            notify({
              message: response?.data?.error.message,
              status: 'error',
            })
            // store.dispatch('systemMessages/addSystemMessage', {
            //   message: error?.message,
            //   status: 'error',
            // })
            // if (error.type && error.type === 'LOGIC-SKIPPABLE') {
            //   resolve(response)
            // } else if (defaultError) {
            //   notify({
            //     message: response?.data?.error.message,
            //     status: 'error',
            //   })
            // }
          }
          resolve(response)
        })
        .catch((error) => {
          if (error.message === 'canceled') {
            return
          }

          // if (error.response?.status === 403) {
          //   reject(error)
          //   if (defaultError) {
          //     notify({
          //       message: i18n.global.t('accessDenied'),
          //       status: 'error',
          //     })
          //   }

          //   return
          // }

          // if (error.response?.status === 408) {
          //   reject(error)
          //   notify({
          //     message: i18n.global.t('requestTimeout'),
          //     status: 'error',
          //   })
          //   return
          // }
          // Method not found
          if (error.response?.status === 404) {
            notify({
              message: 'Метод не найден',
              status: 'error',
            })
            resolve(error.response)
            return
          }
          // // Не валидный формат
          // if (error.response?.data?.error) {
          //   notify({
          //     message: error.response.data.error.message,
          //     status: 'error',
          //   })
          //   reject(error)
          //   return
          // }
          // Сервис недоступен
          // if (error.response?.status >= 503) {
          //   notify({
          //     message: i18n.global.t('serviceIsUnavailableError'),
          //     status: 'error',
          //   })
          //   reject(error)
          //   return
          // }
          // Прочие системные ошибки
          if (
            error.response?.status >= 500 &&
            error.response?.status !== 503 &&
            error.response?.status < 540
          ) {
            toast(`Ошибка сервера, обратись к админу`, { autoClose: 2000, type: 'error', position: 'top-center' })
            reject(error)
          }
          resolve(error.response)
        })
    })
  },
}
