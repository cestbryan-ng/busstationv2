import { AxiosResponse } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import { OrganizationFormType } from "@/lib/types/schema/organizationSchema";
import { Organization } from "@/lib/types/models/Organization";

export async function createOrganization(
    data: OrganizationFormType
): Promise<Organization | null> {
    try {
        const response: AxiosResponse<Organization> = await axiosInstance.post(
            "/organizations",
            data
        );
        if (response.status === 201) {
            console.log(response);
            return response.data;
        } else {
            console.warn("Unattended HTTP code", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error when creating the organization", error);
        throw error;
    }
}