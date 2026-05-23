import {AxiosError, AxiosInstance, InternalAxiosRequestConfig} from "axios";


export const tokenKeyName: string = "bus_station_token_key";

export default function authInterceptor  (axiosInstance: AxiosInstance): void
{
  axiosInstance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
      // Exclure les requêtes de connexion et d'inscription
      if (req.url && (req.url.endsWith("/utilisateur/connexion") || req.url.endsWith("/utilisateur/inscription"))) {
        return req; // Ne pas ajouter de token pour ces requêtes
      }

      const token: string|null = typeof window !== 'undefined' ? localStorage.getItem(tokenKeyName) : null;

      if (token)
      {
        req.headers["Authorization"] = "Bearer " + token;
      }
      return req;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    }
  );
}


