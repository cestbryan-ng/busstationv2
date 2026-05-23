import { AxiosInstance, AxiosError } from "axios";
import { tokenKeyName } from "./auth-interceptor"; // Assurez-vous d'importer la bonne clé si elle est exportée, sinon mettez la string en dur

export default function errorInterceptor(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error: AxiosError) => {
            console.group("Axios Error Interceptor");
            console.error(error);
            console.groupEnd();

            // Gestion de l'expiration du token (401 Unauthorized) ou Interdit (403 Forbidden)
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.warn("Session expirée ou non autorisée. Redirection vers la connexion...");

                // Nettoyage du localStorage
                localStorage.removeItem("bus_station_token"); // Remplacez par votre clé exacte si différente (ex: tokenKeyName)
                localStorage.removeItem("bus_station_token_expirationDate");

                // Redirection forcée vers la page de login si on n'y est pas déjà
                if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                    window.location.href = "/login";
                }
            }

            // Important : Rejeter l'erreur pour que les services (catch) puissent la traiter
            return Promise.reject(error);
        }
    );
}

