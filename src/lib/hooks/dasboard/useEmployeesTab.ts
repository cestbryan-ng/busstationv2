import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormType, employeeFormSchema } from "@/lib/types/schema/employeeSchema";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import { useBusStation } from "@/context/Provider";
import {EmployeRequestDTO, EmployeResponseDTO} from "@/lib/types/generated-api";
import { getEmployeesByAgency, createEmployeeForAgency, updateEmployee, deleteEmployee } from "@/lib/services/employe-service";

export function useEmployeesTab() {


    const { userData, isLoading: isUserLoading } = useBusStation();
    const [employees, setEmployees] = useState<EmployeResponseDTO[]>([]);
    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<EmployeResponseDTO | null>(null);


    const form = useForm<EmployeeFormType>({resolver: zodResolver(employeeFormSchema),});

    const [canOpenConfirmationModal, setCanOpenConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [employeeToDelete, setEmployeeToDelete] = useState<EmployeResponseDTO | null>(null);



    const fetchEmployees = useCallback(async (id: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const data = await getEmployeesByAgency(id) as unknown as EmployeResponseDTO[];
            setEmployees(data || []);
        } catch (error) {
            console.error(error);
            setApiError("Impossible de charger la liste des employés.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialize = async () => {
            if (isUserLoading || !userData?.userId) return;
            try {
                const agency = await getAgencyByChefId(userData.userId);
                if (agency?.agencyId) {
                    setAgencyId(agency.agencyId);
                    await fetchEmployees(agency.agencyId);
                } else {
                    setApiError("Aucune agence n'est associée à votre compte.");
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(error);
                setApiError("Erreur de récupération de votre agence.");
                setIsLoading(false);
            }
        };
        initialize();
    }, [userData, isUserLoading, fetchEmployees]);



    function openModalForCreate(): void  {
        setEditingEmployee(null);
        form.reset({ password: '', confirmPassword: '' });
        setApiError(null);
        setIsModalOpen(true);
    }

    function openModalForEdit (employee: EmployeResponseDTO):void  {
        setEditingEmployee(employee);
        form.reset({
            first_name: employee.firstName,
            last_name: employee.lastName,
            username: employee.username,
            email: employee.email,
            phone_number: employee.phoneNumber,
            poste: employee.poste,
            departement: employee.departement,
            password: '',
            confirmPassword: ''
        });
        setApiError(null);
        setIsModalOpen(true);
    }

    function closeModal (){
        setIsModalOpen(false);
        setEditingEmployee(null);
    }

    async function onSubmit(data: EmployeeFormType): Promise<void> {
        if (!agencyId) {
            setApiError("ID de l'agence introuvable.");
            return;
        }

        setIsSubmitting(true);
        setApiError(null);

        const { confirmPassword, ...baseData } = data;
        const payload: EmployeRequestDTO = {
            ...baseData,
            role: ["EMPLOYE"],
            agenceVoyageId: agencyId,
            userExist: false
        };

        try {
            if (editingEmployee) {
                await updateEmployee(editingEmployee.employeId!, payload);
            } else {
                await createEmployeeForAgency(payload);
            }
            await fetchEmployees(agencyId);
            closeModal();
        } catch (error) {
            console.error(error);
            setApiError("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function openConfirmModal(employee: EmployeResponseDTO) {
        if (employee && employee.employeId) { // ← employeId (unifié avec handleDelete)
            setConfirmationMessage(
                `Êtes-vous sûr de vouloir supprimer l'employé ${employee.firstName} - ${employee.lastName} ?`
                // ← "employé" et non "véhicule"
            );
            setEmployeeToDelete(employee);
            setCanOpenConfirmationModal(true);
        } else {
            setConfirmationMessage("");
            setApiError("Une erreur est survenue, veuillez réessayer plus tard.");
        }
    }

    async function handleDelete(): Promise<void> {
        if (!employeeToDelete || !employeeToDelete.employeId) return; // ← guard AVANT tout effet de bord

        setIsLoading(true);
        setApiError(null);

        await deleteEmployee(employeeToDelete.employeId) // ← deleteEmployee et non deleteVehicle
            .then(() => {
                setEmployees(prev => prev.filter(e => e.employeId !== employeeToDelete.employeId));
                setCanOpenConfirmationModal(false); // ← fermeture modal après succès
                setEmployeeToDelete(null);          // ← nettoyage état
            })
            .catch(() => setApiError("Erreur lors de la suppression, veuillez réessayer plus tard."))
            .finally(() => setIsLoading(false));
    }


    return {
        employees,
        isLoading,
        isSubmitting,
        isModalOpen,
        apiError,
        form,
        editingEmployee,
        openModalForCreate,
        openModalForEdit,
        closeModal,
        onSubmit,
        handleDelete,
        canOpenConfirmationModal,
        setCanOpenConfirmationModal,
        confirmationMessage,
        openConfirmModal
    };
}