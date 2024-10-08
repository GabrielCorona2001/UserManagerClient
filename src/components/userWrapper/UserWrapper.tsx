import { useState } from "react";
import IUser from "../../typing/IUSER";
import "./styles.scss";
import BASE_URL from "../../config/APIconfig";

interface UserWrapperProps {
    selectedUser: IUser | null;  
    closeModal: () => void;
}

function UserWrapper({ selectedUser, closeModal }: UserWrapperProps) {
    const [formData, setFormData] = useState<IUser>(
        selectedUser || { id: 0, name: "", register: "", email: "", password: "" }
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        const nameRegex = /^[A-Za-zÀ-ÿ\s\-'.]+$/;
        const registerRegex = /^\d+$/;
        if (!formData.name) {
            newErrors.name = "Nome é obrigatório.";
        } else if (!nameRegex.test(formData.name)) {
            newErrors.name = "Nome contém caracteres inválidos.";
        }
        if (!formData.register) {
            newErrors.register = "Matrícula é obrigatória.";
        } else if (!registerRegex.test(formData.register)) {
            newErrors.name = "Matrícula deve possuir apenas números.";
        }
        if (!formData.email) {
            newErrors.email = "Email é obrigatório.";
        }
        if (!formData.password) {
            newErrors.password = "Senha é obrigatória.";
        } else if (formData.password.length < 6) {
            newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            const url = selectedUser
                ? `${BASE_URL}/User/UpdateUser`
                : `${BASE_URL}/User/CreateUser`;  

            const method = selectedUser ? 'PUT' : 'POST';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao enviar os dados');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    closeModal();  
                })
                .catch(error => {
                    console.error('Erro ao enviar os dados:', error);
                });
        }
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-content">
                <h2>{selectedUser ? "Editar Usuário" : "Adicionar Usuário"}</h2>
                <form className="form-info" onSubmit={handleSubmit}>
                    {selectedUser && <p>ID: {formData.id}</p>}
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={formData.name}
                        name="name"
                        onChange={handleInputChange}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}

                    <label>Matrícula:</label>
                    <input
                        type="text"
                        value={formData.register}
                        name="register"
                        onChange={handleInputChange}
                    />
                    {errors.register && <span className="error">{errors.register}</span>}

                    <label>Email:</label>
                    <input
                        type="text"
                        value={formData.email}
                        name="email"
                        onChange={handleInputChange}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}

                    <label>Senha:</label>
                    <input
                        type="text"
                        value={formData.password}
                        name="password"
                        onChange={handleInputChange}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <input type="submit" value={selectedUser ? "Salvar" : "Adicionar"} />
                    <button type="button" onClick={closeModal}>Fechar</button>
                </form>
            </div>
        </div>
    );
}

export default UserWrapper;
